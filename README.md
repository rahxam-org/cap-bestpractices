

## Setup Repository



1. Generate a new OpenSSH Key
An Ed25519 key should be generated for each repository; a key should not be used for more than one repository.

`ssh-keygen -t ed25519 -f id_ed25519 -N "" -q -C ""`
`cat id_ed25519.pub id_ed25519`

2. Add Deploy Key to GitHub Repository
Create a new Secret via Settings > Secrets > New repository secret with the name COMMIT_KEY and your Ed25519 private key as the value
Add the public key to the GitHub Repository via Settings > Deploy keys > Add deploy key with Allow write access selected


### Install podman

```sh
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/xUbuntu_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update -qq
sudo apt-get -qq --yes install podman
```

1. Install webhook: `sudo snap install webhook`
2. Create redeployment script: `nano redeployment.sh`
3. Make executable: `sudo chmod 0777 redeployment.sh`
4. Create [Personal access token](https://github.com/settings/tokens) with scope `read:packages`
5. Login to package registry: `podman login ghcr.io --username rahxam`
6. Create 2 new [Secrets](https://github.com/rahxam-org/cap-bestpractices/settings/secrets/actions/new) `DEPLOY_WEBHOOK_URL` and `DEPLOY_WEBHOOK_SECRET`
