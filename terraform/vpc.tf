resource "google_compute_network" "vpc" {
  name                    = "ide-backend-vpc"
  auto_create_subnetworks = false
  routing_mode            = "GLOBAL"
}

resource "google_compute_firewall" "http-only" {
  name    = "ide-backend-allow-http"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports = ["80"]
  }

  priority = 1000

  target_tags = ["ide-backend"]
}

resource "google_compute_subnetwork" "public_subnet" {
  ip_cidr_range            = var.private_subnet_cidr
  name                     = "ide-backend-${var.region}-public-subnet"
  network                  = google_compute_network.vpc.self_link
  region                   = var.region
  enable_flow_logs         = true
}
