

## Setup Repository



1. Generate a new OpenSSH Key
An Ed25519 key should be generated for each repository; a key should not be used for more than one repository.

`ssh-keygen -t ed25519 -f id_ed25519 -N "" -q -C ""`
`cat id_ed25519.pub id_ed25519`

2. Add Deploy Key to GitHub Repository
Create a new Secret via Settings > Secrets > New repository secret with the name COMMIT_KEY and your Ed25519 private key as the value
Add the public key to the GitHub Repository via Settings > Deploy keys > Add deploy key with Allow write access selected
