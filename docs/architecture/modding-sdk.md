# Modding SDK

Status: Draft  
Date: 2026-11-19

## Purpose

Document how users can modify Rayxus simulations through structured content mods.

## Overview

Mods are versioned packages that change simulation content or behavior.

**Recommended early scope:**
- Declarative content mods
- Scenario mods
- Balance/config mods

## Mod Structure

```
my-mod/
├── manifest.json       # Required: mod identity and compatibility
├── README.md           # Optional: description
├── goods/              # Optional: goods definitions
│   └── silk.json
├── jobs/               # Optional: job definitions
│   └── farmer.json
├── laws/               # Optional: law definitions
│   └── taxation.json
├── scenarios/          # Optional: scenario definitions
│   └── my-kingdom.json
└── balance/            # Optional: balance parameters
    └── economy.json
```

## Manifest Schema

```json
{
  "name": "my-mod",
  "version": "1.0.0",
  "author": "username",
  "description": "Adds luxury goods and merchant jobs",
  "license": "MIT",
  "engineCompatibility": ">=0.1.0 <1.0.0",
  "dependencies": [],
  "conflicts": [],
  "provides": ["goods", "jobs"],
  "schemaVersion": "rayxus.mod.manifest.v1"
}
```

## Content Definition Examples

### Goods

```json
// mods/luxury-goods/goods/silk.json
{
  "id": "good:silk",
  "name": "Silk",
  "category": "luxury",
  "basePrice": 100,
  "productionMethod": "gathering",
  "requires": ["resource:silk_cocoon"]
}
```

### Jobs

```json
// mods/luxury-goods/jobs/merchant.json
{
  "id": "job:merchant",
  "name": "Merchant",
  "category": "service",
  "requiredSkill": 0.5,
  "skillGrowth": 0.01,
  "shiftPattern": "flexible"
}
```

### Laws

```json
// mods/custom-laws/laws/taxation.json
{
  "id": "law:taxation",
  "name": "Progressive Taxation",
  "appliesTo": ["population"],
  "parameters": {
    "rates": {
      "low": 0.10,
      "medium": 0.20,
      "high": 0.30
    }
  }
}
```

## Validation

Mods are validated before application:

1. **Schema validation**: Manifest and content files conform to Rayxus schemas
2. **Dependency resolution**: All dependencies can be resolved
3. **Conflict detection**: No conflicting IDs or incompatible requirements
4. **Compatibility check**: Engine version matches compatibility range

### Example Validation Report

```json
{
  "valid": false,
  "errors": [
    { "file": "jobs/merchant.json", "error": "Missing required field 'baseWage'" }
  ],
  "warnings": [
    { "file": "balance/economy.json", "warning": "High inflation risk detected" }
  ]
}
```

## Mod Loading Order

1. Base engine data
2. Loaded mods in dependency order
3. User-applied mods on top
4. Scenario overrides

Mods can override base data. Later mods override earlier ones.

## Conflict Resolution

When mods declare the same ID:

- **Same version**: Last applied wins
- **Different version**: Error reported
- **Compatible changes**: Merge attempted
- **Incompatible changes**: Error reported

## Balance/Config Mods

Mods can specify parameters to tune without full content:

```json
// mods/realistic-economy/tweaks.json
{
  "section": "economy",
  "parameters": {
    "foodWasteRate": 0.02,
    "marketVolatility": 0.15,
    "productionEfficiency": 0.85
  }
}
```

## Scenario Mods

Mods can package complete scenarios:

```json
// mods/historical-scenarios/scenarios/medieval-kingdom.json
{
  "id": "scenario:medieval-kingdom",
  "name": "Medieval Kingdom",
  "description": "A small kingdom in 500 AD",
  "seed": 42,
  "initialState": {
    "population": 1000,
    "land": "medieval",
    "technologyLevel": 2,
    "governmentType": "monarchy"
  },
  "scenariosCommands": []
}
```

## Development Tools

### Schema Validation

```bash
rayxus mod validate my-mod/
```

### Mod Packager

```bash
rayxus mod pack my-mod/
```

Outputs: `my-mod-1.0.0.rxm`

### Conflict Detector

```bash
rayxus mod conflicts mod1/ mod2/ mod3/
```

## Error Handling

Mods that fail validation:
- Are not applied
- Errors are reported to user
- Other mods continue loading

## Versioning Policy

- Major version: Breaking changes
- Minor version: Backward-compatible additions
- Patch version: Bug fixes

## Related

- [Plugin SDK](./plugin-sdk.md) - For code plugins
- [Schema Validation](./schema-validation.md) - Validation rules
- [Data Plugin Guide](./data-plugins.md) - For data-only extensions