variable "project_id" {
  default = "ctfhubio"
}

variable "region" {
  default = "asia-south1"
}

variable "zone" {
  default = "asia-south1-b"
}

variable "private_subnet_cidr" {
  default = "10.12.11.0/24"
}

variable "min_replica" {
  default = 1
}

variable "max_replica" {
  default = 5
}

variable "cool_down_period" {
  default = 600
}

variable "max_unavailable_fixed" {
  default = 0
}

variable "max_surge_fixed" {
  default = 1
}

variable "machine_type" {
  default = "n1-standard-1"
}

variable "instance_service_account" {
  default = "ide-backend@ctfhubio.iam.gserviceaccount.com"
}

variable "app_env" {
  default = "production"
}

variable "app_url" {
  default = "https://ide.ctfhub.io/api"
  description = "Base URL of backend API."
}

variable "app_signing_secret" {
  default = "secret"
  description = "Signing key used by the application."
}

variable "mongo_db_dsn" {
  description = "MongoDB DSN link."
}

variable "google_cloud_project" {
  description = "GCP project name"
}

variable "pubsub_topic_name" {
  description = "Name of Cloud PubSub topic."
}

variable "app_docker_image_name" {
  default = "ifaisalalam/ide-backend"
}
