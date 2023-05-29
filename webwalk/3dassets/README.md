# Avatar

## Model

Avatar model is exported from Blender as .obj file with head facing the positive
direction of the Y axis and with the following exporting options:

- Forward: Y Forward
- Up: Z Up
- Write Normals
- Include UV
- (Write Materials should be off)

Each elements needs to have it's origin placed at world center (0.0.0)

## Configuration file

Avatar configuration file is a .json file, placed within the same directory as .obj file.
It contains the following fields:

- `model` - filename of the avatar model, ex: `avatar.obj`
- `meshes` - list of meshes that are part of the avatar, each element has to contain fields:
  - `group` - name of the avatar part, one of four: `head, torso, displayLandscape, displayPortrait`
  - `geometryName` - name of the geometry name in the model file.
  - `materialName` - name of the material specified in material list below. (optional, defaults to default material)
- `materials` - list of materials configurations, each element has to contain fields:
  - `name` - name of the material, ex: `white`
  - `baseColor` - base color of the material, ex: `[1.0, 1.0, 1.0]`
  - `baseColorTexture` - filename of the base color texture as `file` property, ex: `{"file": "white.png"}`. (optional)
  - `roughness` - roughness value of the material, ex: `0.5`
  - `metallic` - metallic value of the material, ex: `0.5`

Open `3dassets/example_avatar_config.json` for example configuration file.

## Textures

Textures are placed in the same directory as .obj file and must be referenced in the `materials` section of .json configuration file.
Each material has optional `baseColorTexture` property.

## Brotli encoding

File br.buf is a test file compressed by Brotli to check if
browser supports Brotli encoding.

## Test custom avatar

Provide `WALK.AVATAR_JSON_URL_OVERRIDE` as url to local json file in `DevelConfig.js` file.
