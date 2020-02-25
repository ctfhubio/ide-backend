data "google_compute_image" "vm_image" {
  family  = "ubuntu-1604-lts"
  project = "ubuntu-os-cloud"
}

resource "google_compute_instance_template" "ide_backend" {
  name_prefix = "ide-backend-template"
  description = "This template is used to create IDE backend instances which interacts with client API calls."

  tags = ["ide-backend"]

  labels = {
    service = "ide"
    class   = "backend"
  }

  machine_type = var.machine_type

  disk {
    source_image = data.google_compute_image.vm_image.self_link
    auto_delete  = true
    boot         = true
  }

  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public_subnet.name
    access_config {
      network_tier = "PREMIUM"
    }
  }

  service_account {
    email = var.instance_service_account
    // The best practice is to set the full "cloud-platform" access scope on the instance,
    // then securely limit your service account's access by granting IAM roles to the service account.
    scopes = ["cloud-platform"]
  }

  lifecycle {
    create_before_destroy = true
  }

  metadata_startup_script = <<SCRIPT
#!/bin/bash

apt-get -y update

curl https://get.docker.com | sh
systemctl start docker

groupadd docker

mkdir /app
cd /app
touch /app/.env

tee -a /app/.env > /dev/null <<ENV
NODE_ENV=${var.app_env}
BASE_URL=${var.base_url}
APP_URL=${var.app_url}
APP_SIGNING_SECRET=${var.app_signing_secret}
MONGO_DB_DSN=${var.mongo_db_dsn}
GOOGLE_CLOUD_PROJECT=${var.google_cloud_project}
PUBSUB_TOPIC_NAME=${var.pubsub_topic_name}
PUBSUB_VERIFICATION_TOKEN=${var.pubsub_verification_token}
ENV

docker pull ${var.app_docker_image_name}:latest

docker run \
  --detach \
  -p 80:3000 \
  --env-file /app/.env \
  --restart always \
  ${var.app_docker_image_name}
SCRIPT
}

resource "google_compute_instance_group_manager" "ide_backend_instance_group" {
  provider = "google-beta"
  project  = var.project_id

  name               = "ide-backend"
  base_instance_name = "ide-backend"
  zone               = var.zone
  target_size        = var.min_replica

  version {
    name              = "ide-backend"
    instance_template = google_compute_instance_template.ide_backend.self_link
  }

  update_policy {
    minimal_action        = "REPLACE"
    type                  = "PROACTIVE"
    min_ready_sec         = var.cool_down_period
    max_unavailable_fixed = var.max_unavailable_fixed
    max_surge_fixed       = var.max_surge_fixed
  }

  auto_healing_policies {
    health_check = google_compute_health_check.ide_backend.self_link
    initial_delay_sec = 630
  }
}

resource "google_compute_autoscaler" "ide_backend_autoscaler" {
  provider = "google-beta"
  project  = var.project_id

  name   = "ide-backend-autoscaler"
  zone   = var.zone
  target = google_compute_instance_group_manager.ide_backend_instance_group.self_link

  autoscaling_policy {
    max_replicas    = var.max_replica
    min_replicas    = var.min_replica
    cooldown_period = var.cool_down_period

    cpu_utilization {
      target = 0.6
    }
  }
}

resource "google_compute_health_check" "ide_backend" {
  name = "ide-backend-health-check"

  check_interval_sec = 3
  timeout_sec = 2

  http_health_check {
    request_path = "/_/healthcheck"
    response = "OK"
  }
}
