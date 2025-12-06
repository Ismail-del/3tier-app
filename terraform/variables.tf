
variable "postgres_image" {
  description = "PostgreSQL Docker image version"
  type        = string
  default     = "postgres:15"
}

variable "postgres_db" {
  description = "PostgreSQL database name"
  type        = string
  default     = "beers"
}

variable "postgres_user" {
  description = "PostgreSQL username"
  type        = string
  default     = "postgres"
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  default     = "password"
  sensitive   = true
}

variable "postgres_port" {
  description = "PostgreSQL port"
  type        = number
  default     = 5432
}


variable "gitlab_runner_image" {
  description = "GitLab Runner Docker image version"
  type        = string
  default     = "gitlab/gitlab-runner:latest"
}

variable "runner_build_name" {
  description = "Name for the build runner container"
  type        = string
  default     = "runner-build-3tier"
}

variable "runner_deploy_name" {
  description = "Name for the deploy runner container"
  type        = string
  default     = "runner-deploy-3tier"
}


variable "network_name" {
  description = "Docker network name for the landing zone"
  type        = string
  default     = "beer-app-landingzone"
}


variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "beer-app"
}
