# Premake Downloader
Downloads Premake for GitHub Actions

## Usage

Simplest (downloads latest version)
```yaml
- name: Download Premake
  # Any version number can be used, 1.5.1 is the most recent as of 11/07/2026
  uses: 0xsmft/premake-action@v1.5.1
- name: Run Premake
  # premake-action will automatically add premake to the PATH enviroment variable.
  run: premake5 my_action
```
Specify a Premake version
```yaml
- name: Download Premake
  uses: 0xsmft/premake-action@v1.5.1
  with:
    args: --premake-version=v5.0.0-beta8
- name: Run Premake
  run: premake5 my_action
```
