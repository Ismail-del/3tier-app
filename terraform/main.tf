
resource "docker_network" "landingzone_network" {
  name   = var.network_name
  driver = "bridge"
}


resource "docker_volume" "postgres_data" {
  name = "${var.project_name}-postgres-data"
}


resource "docker_container" "postgres" {
  name  = "${var.project_name}-postgres-db"
  image = docker_image.postgres.image_id

  networks_advanced {
    name = docker_network.landingzone_network.name
  }

  ports {
    internal = var.postgres_port
    external = var.postgres_port
  }


  env = [
    "POSTGRES_DB=${var.postgres_db}",
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}"
  ]


  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }


  restart = "unless-stopped"


  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${var.postgres_user} -d ${var.postgres_db}"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }
}


resource "docker_image" "postgres" {
  name = var.postgres_image
}


resource "docker_volume" "runner_build_config" {
  name = "${var.project_name}-runner-build-config"
}


resource "docker_volume" "runner_deploy_config" {
  name = "${var.project_name}-runner-deploy-config"
}


resource "docker_image" "gitlab_runner" {
  name = var.gitlab_runner_image
}

resource "docker_container" "gitlab_runner_build" {
  name  = var.runner_build_name
  image = docker_image.gitlab_runner.image_id


  networks_advanced {
    name = docker_network.landingzone_network.name
  }


  volumes {
    volume_name    = docker_volume.runner_build_config.name
    container_path = "/etc/gitlab-runner"
  }


  volumes {
    host_path      = "//./pipe/docker_engine"
    container_path = "/var/run/docker.sock"
  }


  privileged = true


  restart = "unless-stopped"


  command = ["run", "--user=gitlab-runner", "--working-directory=/home/gitlab-runner"]
}

resource "docker_container" "gitlab_runner_deploy" {
  name  = var.runner_deploy_name
  image = docker_image.gitlab_runner.image_id


  networks_advanced {
    name = docker_network.landingzone_network.name
  }


  volumes {
    volume_name    = docker_volume.runner_deploy_config.name
    container_path = "/etc/gitlab-runner"
  }

  volumes {
    host_path      = "//./pipe/docker_engine"
    container_path = "/var/run/docker.sock"
  }


  privileged = true


  restart = "unless-stopped"


  command = ["run", "--user=gitlab-runner", "--working-directory=/home/gitlab-runner"]
}
