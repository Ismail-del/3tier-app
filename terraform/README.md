# 🏗️ Terraform Landing Zone - Beer App

This Terraform configuration deploys the landing zone infrastructure for the Beer App project, including:
- PostgreSQL database for storing beer data
- GitLab runners for CI/CD pipeline execution
- Docker network for container communication

## 📋 Prerequisites

Before using this Terraform configuration, ensure you have:

1. **Docker Desktop** installed and running on Windows
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running before executing Terraform commands

2. **Terraform** installed (version >= 1.0)
   - Download from: https://www.terraform.io/downloads
   - Or install via Chocolatey: `choco install terraform`

3. **GitLab Account** with access to your project repository
   - You'll need the GitLab instance URL and registration token

## 🚀 Quick Start

### 1. Initialize Terraform

Navigate to the terraform directory and initialize:

```powershell
cd terraform
terraform init
```

This will download the required Docker provider.

### 2. Review the Deployment Plan

Preview what Terraform will create:

```powershell
terraform plan
```

Expected resources:
- 1 Docker network (`beer-app-landingzone`)
- 1 PostgreSQL container (`beer-app-postgres-db`)
- 2 GitLab runner containers (`runner-build-3tier`, `runner-deploy-3tier`)
- 3 Docker volumes (for data persistence)

### 3. Deploy the Infrastructure

Apply the Terraform configuration:

```powershell
terraform apply
```

Type `yes` when prompted to confirm the deployment.

### 4. Verify Deployment

After successful deployment, verify the containers are running:

```powershell
docker ps
```

You should see:
- `beer-app-postgres-db` (PostgreSQL database)
- `runner-build-3tier` (GitLab runner for building images)
- `runner-deploy-3tier` (GitLab runner for Kubernetes deployments)

### 5. View Connection Information

Display the outputs with connection details:

```powershell
terraform output
```

This will show:
- PostgreSQL connection string
- Container names and IDs
- Runner registration commands

## 🔧 Configuration

### Default Values

The default configuration uses these values (defined in `terraform.tfvars`):

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `postgres_db` | `beers` | Database name |
| `postgres_user` | `postgres` | Database username |
| `postgres_password` | `password` | Database password |
| `postgres_port` | `5432` | Database port |
| `network_name` | `beer-app-landingzone` | Docker network name |

### Customizing Variables

To customize the configuration, you can:

1. **Edit `terraform.tfvars`** (recommended for persistent changes)
2. **Use command-line flags** (for temporary overrides):
   ```powershell
   terraform apply -var="postgres_password=mysecurepassword"
   ```

## 🎯 GitLab Runner Registration

After deploying the infrastructure, you need to register the runners with GitLab.

### Register Build Runner (runner-build-3tier)

This runner is used for building Docker images.

```powershell
docker exec -it runner-build-3tier gitlab-runner register
```

When prompted, enter:
1. **GitLab instance URL**: `https://gitlab.com/` (or your self-hosted URL)
2. **Registration token**: Get from GitLab → Settings → CI/CD → Runners → New project runner
3. **Description**: `runner-build-3tier`
4. **Tags**: `docker,build` (or leave empty)
5. **Executor**: `docker`
6. **Default Docker image**: `docker:24.0.5`

### Register Deploy Runner (runner-deploy-3tier)

This runner is used for Kubernetes deployments.

```powershell
docker exec -it runner-deploy-3tier gitlab-runner register
```

When prompted, enter:
1. **GitLab instance URL**: `https://gitlab.com/` (or your self-hosted URL)
2. **Registration token**: Same as above (or create a new runner)
3. **Description**: `runner-deploy-3tier`
4. **Tags**: `kubernetes,deploy` (or leave empty)
5. **Executor**: `docker`
6. **Default Docker image**: `alpine:latest`

### Verify Runner Registration

Check that runners are registered and active:

```powershell
# For build runner
docker exec -it runner-build-3tier gitlab-runner list

# For deploy runner
docker exec -it runner-deploy-3tier gitlab-runner list
```

In GitLab, go to **Settings → CI/CD → Runners** to see your runners with green status indicators.

## 🗄️ PostgreSQL Database

### Connection Details

After deployment, connect to PostgreSQL using:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `beers`
- **Username**: `postgres`
- **Password**: `password`
- **JDBC URL**: `jdbc:postgresql://localhost:5432/beers`

### Accessing the Database

Connect to PostgreSQL via Docker:

```powershell
docker exec -it beer-app-postgres-db psql -U postgres -d beers
```

### Testing the Database

Create a test table and insert data:

```sql
-- List tables
\dt

-- Create a test table (if not exists)
CREATE TABLE IF NOT EXISTS beers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2)
);

-- Insert test data
INSERT INTO beers (name, rating) VALUES ('Heineken', 4.5);

-- Query data
SELECT * FROM beers;

-- Exit
\q
```

### Data Persistence

PostgreSQL data is stored in a Docker volume (`beer-app-postgres-data`), ensuring data persists even if the container is stopped or recreated.

## 🔗 Integration with Existing Project

### Update Backend Configuration

Your backend application can connect to the Terraform-managed PostgreSQL database. The connection details are already configured in your `docker-compose.yml`, but you can update them to use the Terraform-managed database:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/beers
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: password
```

### Update GitLab CI/CD

Your `.gitlab-ci.yml` can now use the registered runners by specifying tags:

```yaml
build_backend:
  tags:
    - docker
    - build
  # ... rest of job configuration

deploy_to_kubernetes:
  tags:
    - kubernetes
    - deploy
  # ... rest of job configuration
```

## 🛠️ Management Commands

### View Infrastructure State

```powershell
# Show current state
terraform show

# List all resources
terraform state list

# Show specific resource
terraform state show docker_container.postgres
```

### Update Infrastructure

After modifying configuration files:

```powershell
terraform plan   # Review changes
terraform apply  # Apply changes
```

### Destroy Infrastructure

To remove all resources created by Terraform:

```powershell
terraform destroy
```

**Warning**: This will delete the PostgreSQL database and all data. Make sure to backup any important data first.

### Backup PostgreSQL Data

Before destroying infrastructure:

```powershell
# Backup database
docker exec beer-app-postgres-db pg_dump -U postgres beers > backup.sql

# Restore database (after recreating)
docker exec -i beer-app-postgres-db psql -U postgres beers < backup.sql
```

## 📊 Outputs

Terraform provides useful outputs after deployment:

```powershell
terraform output
```

Available outputs:
- `postgres_connection_string` - JDBC connection string
- `postgres_host` - Database host
- `postgres_port` - Database port
- `postgres_container_name` - PostgreSQL container name
- `runner_build_container_name` - Build runner container name
- `runner_deploy_container_name` - Deploy runner container name
- `runner_build_registration_command` - Command to register build runner
- `runner_deploy_registration_command` - Command to register deploy runner
- `network_name` - Docker network name

## 🐛 Troubleshooting

### Docker Provider Connection Issues

If you encounter errors connecting to Docker:

1. Ensure Docker Desktop is running
2. Check Docker is accessible:
   ```powershell
   docker ps
   ```
3. Verify the Docker socket path in `versions.tf` is correct for Windows:
   ```hcl
   host = "npipe:////./pipe/docker_engine"
   ```

### Container Not Starting

Check container logs:

```powershell
# PostgreSQL logs
docker logs beer-app-postgres-db

# Runner logs
docker logs runner-build-3tier
docker logs runner-deploy-3tier
```

### Port Already in Use

If port 5432 is already in use, you can change it:

1. Edit `terraform.tfvars`:
   ```hcl
   postgres_port = 5433
   ```
2. Apply changes:
   ```powershell
   terraform apply
   ```

### Runner Registration Fails

If runner registration fails:

1. Verify GitLab token is correct
2. Check network connectivity to GitLab
3. Ensure runner container is running:
   ```powershell
   docker ps | findstr runner
   ```

## 📁 Project Structure

```
terraform/
├── main.tf              # Main infrastructure configuration
├── variables.tf         # Variable definitions
├── outputs.tf          # Output definitions
├── versions.tf         # Provider and version constraints
├── terraform.tfvars    # Default variable values
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔒 Security Notes

- Default passwords are used for development purposes
- For production, use secure passwords and consider using Terraform Cloud or encrypted state
- Never commit `terraform.tfstate` files to version control (already in `.gitignore`)
- Consider using environment variables for sensitive values:
  ```powershell
  $env:TF_VAR_postgres_password="secure_password"
  terraform apply
  ```

## 📚 Additional Resources

- [Terraform Docker Provider Documentation](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs)
- [GitLab Runner Documentation](https://docs.gitlab.com/runner/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Docker Networking](https://docs.docker.com/network/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Terraform and Docker logs
3. Verify all prerequisites are installed
4. Ensure Docker Desktop is running

## 📝 License

This Terraform configuration is part of the Beer App kata project.
