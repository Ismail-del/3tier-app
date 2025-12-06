output "postgres_host" {
  description = "PostgreSQL host address"
  value       = "localhost"
}

output "postgres_port" {
  description = "PostgreSQL port"
  value       = var.postgres_port
}

output "postgres_database" {
  description = "PostgreSQL database name"
  value       = var.postgres_db
}

output "postgres_connection_string" {
  description = "PostgreSQL JDBC connection string"
  value       = "jdbc:postgresql://localhost:${var.postgres_port}/${var.postgres_db}"
}

output "postgres_container_name" {
  description = "PostgreSQL container name"
  value       = docker_container.postgres.name
}

output "postgres_container_id" {
  description = "PostgreSQL container ID"
  value       = docker_container.postgres.id
}


output "runner_build_container_name" {
  description = "Build runner container name"
  value       = docker_container.gitlab_runner_build.name
}

output "runner_build_container_id" {
  description = "Build runner container ID"
  value       = docker_container.gitlab_runner_build.id
}

output "runner_deploy_container_name" {
  description = "Deploy runner container name"
  value       = docker_container.gitlab_runner_deploy.name
}

output "runner_deploy_container_id" {
  description = "Deploy runner container ID"
  value       = docker_container.gitlab_runner_deploy.id
}


output "network_name" {
  description = "Docker network name"
  value       = docker_network.landingzone_network.name
}

output "network_id" {
  description = "Docker network ID"
  value       = docker_network.landingzone_network.id
}

output "runner_build_registration_command" {
  description = "Command to register the build runner"
  value       = "docker exec -it ${docker_container.gitlab_runner_build.name} gitlab-runner register"
}

output "runner_deploy_registration_command" {
  description = "Command to register the deploy runner"
  value       = "docker exec -it ${docker_container.gitlab_runner_deploy.name} gitlab-runner register"
}
