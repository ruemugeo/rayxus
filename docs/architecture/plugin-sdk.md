# Plugin SDK

Status: Draft  
Date: 2026-11-19

## Purpose

Document how third-party developers can extend Rayxus through plugins.

## Overview

Plugins are packaged extensions that add data, rules, projections, visualizations, adapters, or tools through declared contracts.

Rayxus v1.0 supports **data plugins first**, with executable plugins as a later milestone.

## Plugin Types

### Data Plugins

Declarative content mods that extend engine data without code.

**Examples:**
- Goods catalogs (food, materials, luxury items)
- Job definitions (farmers, artisans, administrators)
- Laws and policies (tax rates, building codes)
- Cultures and names
- Scenario templates

### Rule Plugins

Executable plugins that add new systems or modify rules through declared hooks.

**Examples:**
- New simulation systems
- Modified decision algorithms
- Custom event triggers
- Extended command handling

### Projection Plugins

Plugins that add new read models for UI, analytics, or debugging.

**Examples:**
- Custom statistics
- Event timelines
- Causality graphs
- Population charts

### Visualization Plugins

Plugins that add debug views and custom inspectors.

**Examples:**
- Map overlays
- Data dashboards
- Inspection tools

## Plugin Contract

All plugins must declare their capabilities in a manifest file:

```json
{
  "name": "my-economic-mod",
  "version": "1.0.0",
  "description": "Adds luxury goods to the economy",
  "engineCompatibility": ">=0.1.0 <1.0.0",
  "capabilities": {
    "data": {
      "goods": {
        "luxury": true,
        "manufactured": true
      }
    }
  },
  "dependencies": [],
  "entryPoints": [
    { "type": "data", "module": "data/goods.ts" }
  ]
}
```

## Data Pack Example

```json
// plugins/luxury-goods/manifest.json
{
  "name": "luxury-goods",
  "version": "1.0.0",
  "schema": "rayxus.plugin.manifest.v1",
  "exports": {
    "goods": {
      "silk": { "name": "Silk", "category": "luxury", "basePrice": 100 },
      "wine": { "name": "Wine", "category": "luxury", "basePrice": 50 }
    }
  }
}
```

## Plugin Loading

Plugins are loaded in a sandboxed environment:

1. Validate manifest against schema
2. Check engine compatibility
3. Resolve dependencies
4. Load exported data
5. Register with kernel

## Security Considerations

- Data plugins have no code execution
- Rule plugins require explicit permission
- All plugins are validated against schema
- Plugin conflicts are reported before application

## Versioning

Plugins declare version compatibility:

```json
{
  "compatibility": {
    "engine": "0.1.0 - 0.4.0",
    "api": "rayxus.kernel.v1"
  }
}
```

## Development

```bash
# Create plugin structure
mkdir plugins/my-plugin
cd plugins/my-plugin

# Create manifest
echo '{"name":"my-plugin","version":"1.0.0"}' > manifest.json

# Add data or code
mkdir src
```

## Documentation Structure

- [Plugin Manifest Schema](./plugin-manifest-schema.md)
- [Data Plugin Guide](./data-plugins.md)
- [Rule Plugin Guide](./rule-plugins.md)
- [Projection Plugin Guide](./projection-plugins.md)
- [Security Model](./plugin-security.md)

## Future Work

- v1.0: Data plugins, declarative mods
- v1.1: Rule plugins with stable contracts
- v1.2: Visualization plugins
- v2.0: Sandbox execution for rule plugins