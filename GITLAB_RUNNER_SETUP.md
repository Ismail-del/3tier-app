# GitLab Runner Setup Guide

This guide will help you set up a GitLab Runner using Docker and link it to your GitLab repository.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Maintainer access to the GitLab repository to get the registration token.

## Step 1: Start the Runner Container

We have created a `docker-compose.runner.yml` file for you. Run the following command to start the runner:

```bash
docker-compose -f docker-compose.runner.yml up -d
```

This will start the GitLab Runner in the background.

## Step 2: Obtain the Registration Token

1. Go to your GitLab project.
2. Navigate to **Settings** > **CI/CD**.
3. Expand the **Runners** section.
4. Click on **New project runner**.
5. Add tags if you want (e.g., `docker`, `linux`), or leave blank.
6. Click **Create runner**.
7. Copy the **Registration token** (or the authentication token if using the new flow).

## Step 3: Register the Runner

Now you need to link your running container to GitLab. Run the following command:

```bash
docker exec -it gitlab-runner gitlab-runner register
```

You will be prompted to enter the following information:

1.  **Enter the GitLab instance URL**:
    - Type: `https://gitlab.com/` (or your self-hosted URL).
2.  **Enter the registration token**:
    - Paste the token you copied in Step 2.
3.  **Enter a description for the runner**:
    - Type something like: `my-docker-runner`.
4.  **Enter tags for the runner (comma-separated)**:
    - You can leave this empty or add tags like `docker`.
5.  **Enter optional maintenance note**:
    - Leave empty.
6.  **Enter an executor**:
    - **CRITICAL**: Type `docker`.
7.  **Enter the default Docker image**:
    - Type `docker:24.0.5` (or any default image you prefer, e.g., `alpine:latest`).

## Step 4: Configure Docker Privileges (Optional but Recommended)

To allow the runner to build Docker images (Docker-in-Docker), you might need to edit the configuration.

1.  Open the generated config file (it will appear in `./config/gitlab-runner/config.toml` on your host machine after registration).
2.  Find the `[runners.docker]` section.
3.  Change `privileged = false` to `privileged = true`.
4.  Save the file.
5.  Restart the runner:

```bash
docker-compose -f docker-compose.runner.yml restart
```

## Verification

Go back to **Settings** > **CI/CD** > **Runners** in your GitLab project. You should see your new runner listed with a green circle indicating it is online.
