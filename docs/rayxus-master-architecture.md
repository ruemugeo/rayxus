# Rayxus Master Architecture Proposal

Version: v1 planning draft  
Date: 2026-08-01  
Status: Pre-implementation architecture proposal

## 1. Vision

Rayxus is a professional civilization simulation engine, not a single game, website, or demo. It should become a portable simulation platform capable of modeling believable societies from individual citizens to kingdoms and, later, planets.

The long-term product comparison is closer to Unity, Unreal Engine, or a scientific simulation framework than to a city-builder. Rayxus should expose reusable simulation primitives, domain modules, inspection tools, replay tooling, and extension APIs that other applications can build on.

Success means Rayxus can answer two questions at every scale:

1. What happened?
2. Why did it happen?

The second question is the differentiator. Rayxus must treat causality, explanation, and inspection as first-class engine features, not UI polish added after simulation logic is complete.

## 2. Mission

Build the world's most modular, explainable, extensible, portable, and scalable civilization simulation engine.

Rayxus should:

- Run locally, in browsers, on VPS hosts, on cloud infrastructure, and on dedicated servers.
- Keep simulation independent from UI, rendering, networking, and storage.
- Support deterministic or near-deterministic replay for debugging, testing, education, and research.
- Allow storage, renderer, frontend, and deployment targets to be replaced without modifying simulation modules.
- Support long-term evolution through versioned schemas, module contracts, plugin APIs, and architecture decision records.
- Prioritize stable foundations over quick visual demos.

## 3. Core Principles

- Simulation first, visualization second.
- Engine core must not import UI, database, rendering, or networking code.
- Every major subsystem must expose explicit inputs, outputs, invariants, and explanation data.
- Systems should be replaceable through ports and adapters.
- Data-driven design is preferred where it improves extensibility, but hard-coded domain rules are acceptable when they preserve clarity and correctness.
- Development should proceed version by version. Each version should produce stable engine capability, not just visible features.
- Headless mode is mandatory from the beginning.
- Save/load, replay, and debugging must be designed early because they shape state architecture.
- Avoid feature creep. Prefer one deep, inspectable subsystem over many shallow systems.
- Favor long-term schema and module stability over short-term convenience.

## 4. Pillars

Rayxus is organized into nine pillars. Systems may belong to more than one pillar, but each system needs one primary owner to prevent architectural drift.

| Pillar | Scope | Examples |
| --- | --- | --- |
| World | Physical and geographic simulation context | Time, terrain, regions, resources, climate, settlements |
| Life | Individual and household simulation | Citizens, families, needs, health, housing |
| Society | Collective social organization | Culture, class, law, government, institutions |
| Economy | Production, consumption, ownership, exchange | Food, jobs, markets, trade, housing economy |
| Conflict | Violence, coercion, security, unrest | Military, crime, rebellion, war logistics |
| History | Memory, causality, statistics, replay | Events, timelines, Time Machine, historical queries |
| Intelligence | Decision-making and explanation | AI, planners, policies, AI Inspector, why trees |
| Visualization | Human-facing presentation and debug views | React tools, D3 charts, WebGPU maps, visual debug |
| Engine | Runtime, portability, persistence, extensibility | Scheduler, plugin system, storage ports, networking ports |

### Subsystem Mapping

| Subsystem | Primary Pillar | Secondary Pillars |
| --- | --- | --- |
| Time | Engine | World, History |
| Citizens | Life | Society, Economy, Intelligence |
| Families | Life | Society, History |
| Economy | Economy | Society, Intelligence |
| Food | Economy | World, Life |
| Jobs | Economy | Life, Society |
| Housing | Life | Economy, Society |
| Government | Society | Economy, Conflict, History |
| Trade | Economy | Diplomacy, World |
| Military | Conflict | Government, Economy, History |
| Diplomacy | Society | Conflict, Economy, Intelligence |
| Events | History | Engine, Intelligence |
| History | History | Society, Intelligence |
| Statistics | History | Visualization, Engine |
| AI | Intelligence | Life, Society, Economy, Conflict |
| Save/Load | Engine | History |
| Plugins | Engine | All pillars |
| Modding | Engine | Visualization, All domain pillars |
| Replay | History | Engine, Visualization |
| Time Machine | History | Engine, Visualization |
| Headless Mode | Engine | All pillars |
| Visual Debug Mode | Visualization | Engine, History |
| AI Inspector | Intelligence | Visualization, History |

## 5. Software Architecture

### Recommended Architecture

Rayxus should use a modular monorepo with a hexagonal architecture:

- Core simulation packages define domain state, systems, rules, events, commands, and explanation models.
- Ports define abstract contracts for storage, rendering, networking, random sources, worker execution, logging, and metrics.
- Adapters implement those ports for JSON, SQLite, PostgreSQL, browser storage, WebGPU, React, CLI tools, dedicated servers, and cloud deployment.
- Applications compose core packages with selected adapters.

The core rule:

Simulation packages may depend inward on engine abstractions and shared schema packages. They must not depend outward on React, D3, WebGPU, SQLite, PostgreSQL, HTTP servers, or filesystem APIs.

### Layer Model

| Layer | Responsibility | Must Avoid |
| --- | --- | --- |
| Simulation Kernel | Time, scheduler, entity registry, command processing, event journal, deterministic random streams | Domain-specific policy |
| Domain Modules | World, life, society, economy, conflict, diplomacy, AI rules | UI rendering, direct database calls |
| Explanation Layer | Cause/effect records, decision traces, event provenance, why queries | Narrative-only text without structured data |
| Projection Layer | Read models for UI, analytics, charts, search, dashboards | Owning authoritative simulation state |
| Ports | Storage, renderer, network, worker, telemetry, plugin contracts | Concrete runtime assumptions |
| Adapters | JSON, SQLite, PostgreSQL, WebGPU, React, D3, server transports | Domain rules |
| Applications | Studio, CLI runner, headless server, browser sandbox | Business logic hidden outside modules |

### Key Recommendation: Pure TypeScript Core

Use TypeScript for the engine core, with strict portability rules.

Why this fits:

- Browser execution and server execution share one language.
- Type definitions help plugin authors and tool builders.
- React/TypeScript frontend can consume engine schemas directly.
- WASM can still be introduced later for hot loops without rewriting the engine contract.

Trade-off:

- TypeScript is not ideal for massive agent counts or numeric-heavy simulation at planetary scale.
- Mitigation: design data-oriented state containers, deterministic workers, LOD simulation, and optional WASM acceleration behind stable ports.

### Key Recommendation: Hybrid ECS and Domain Model

Do not build Rayxus as pure object-oriented entities. Do not build it as a pure game ECS either.

Options:

| Approach | Strength | Weakness |
| --- | --- | --- |
| Object-oriented domain objects | Easy to understand early | Hard to serialize, replay, diff, parallelize, and inspect at scale |
| Pure ECS | Fast and modular | Can become opaque for explainable civilization logic |
| Relational model as source of truth | Queryable and durable | Couples simulation to storage and slows core logic |
| Hybrid entity/component state plus domain systems | Portable, inspectable, scalable enough, modular | Requires discipline around boundaries |

Recommendation:

Use stable entity IDs, component-like state records, domain systems, and explicit event outputs. Keep behavior in systems, not entity methods. Use domain terminology in modules so the architecture remains understandable to non-engine specialists.

### Key Recommendation: Event Journal plus Snapshots

Save/load, replay, Time Machine, statistics, and explanation all need historical structure.

Options:

| Approach | Strength | Weakness |
| --- | --- | --- |
| Snapshot-only saves | Simple and fast to load | Weak replay, weak causality, poor debugging |
| Pure event sourcing | Excellent auditability | Can become heavy and complex for high-frequency simulation |
| Hybrid snapshots plus event journal | Balanced debugging, replay, and performance | Requires snapshot/event schema versioning |

Recommendation:

Use periodic authoritative snapshots plus append-only event journals between snapshots. Important historical events get structured cause records. High-frequency low-value events can be summarized into aggregates.

### Portability Targets

Rayxus should support these runtime modes through composition, not forks:

| Runtime | Entry Style | Core Requirement |
| --- | --- | --- |
| Local CLI | Headless simulation runner | No browser or database dependency |
| Browser | Web worker simulation plus UI shell | No Node-only dependency in core |
| Desktop app | Local adapters around core | Same core packages |
| VPS/dedicated server | Headless authoritative simulation | Deterministic command/event stream |
| Cloud | Sharded workers and external storage | Stable serialization and partition strategy |

## 6. Folder Structure

Target structure should separate core engine, domain modules, adapters, tools, and apps.

```text
rayxus/
  docs/
    architecture/
    adr/
    roadmap/
    simulation-design/
  packages/
    engine-core/
      kernel/
      time/
      scheduler/
      entities/
      commands/
      events/
      explanation/
      random/
    schemas/
      save/
      events/
      modules/
      plugins/
    modules/
      world/
      life/
      society/
      economy/
      conflict/
      diplomacy/
      history/
      intelligence/
    projections/
      statistics/
      timelines/
      maps/
      inspector/
    ports/
      storage/
      rendering/
      networking/
      workers/
      telemetry/
    adapters/
      storage-json/
      storage-sqlite/
      storage-postgres/
      renderer-webgpu/
      charts-d3/
      network-local/
      network-server/
    plugin-sdk/
    modding-sdk/
  apps/
    studio/
    headless-runner/
    browser-sandbox/
    dedicated-server/
    visual-debugger/
  scenarios/
    smoke/
    economy-lab/
    kingdom-lab/
  tests/
    golden/
    invariants/
    performance/
    replay/
```

Folder rule:

Anything under `packages/modules` must be able to run without `apps`, `adapters`, or frontend packages.

## 7. Data Flow

Rayxus should use a command -> simulation -> event -> projection flow.

1. Inputs enter as commands, scenario data, plugin rules, or scheduled internal actions.
2. Kernel validates command timing and routes work to domain systems.
3. Domain systems read current simulation state and emit state changes plus events.
4. Explanation layer attaches causes, contributing factors, actor intent, constraints, and confidence where relevant.
5. Event journal records important facts for replay, Time Machine, statistics, and inspection.
6. Projection layer builds read models for UI, charts, maps, reports, search, and network clients.
7. Storage adapter persists snapshots, event journals, metadata, and projections as needed.
8. Visualization layer reads projections and debug streams. It never mutates simulation state directly.

### Authoritative State

Authoritative state lives only in the simulation runtime. Storage contains serialized state. UI contains projections. Network clients contain synchronized views. None of those should become hidden sources of truth.

### Explanation Data Flow

Every significant event should support a structured explanation:

- Direct cause: immediate rule or condition that triggered the event.
- Contributing factors: pressures that made the event more likely.
- Actor intent: goal, policy, need, or order driving an action.
- Constraints: unavailable resources, law, distance, time, risk, social rule, or physical limit.
- Alternatives considered: optional for AI decisions and high-value events.
- Resulting effects: state changes and downstream events.

This allows Rayxus to answer "why did this village starve?", "why did this ruler raise taxes?", or "why did this army lose?" through inspectable causal chains.

## 8. Version Roadmap

The roadmap should stay stable. Each release should finish one engine capability layer before expanding to the next.

### v0.0 Architecture Foundation

Purpose: establish contracts before feature work.

Deliverables:

- Architecture proposal.
- Initial ADR set.
- Module boundary definitions.
- Simulation vocabulary.
- Save/event schema strategy.
- Test strategy.

Exit criteria:

- Team can explain what belongs in core, module, adapter, and app layers.
- No UI, database, or rendering decision can leak into simulation design.

### v0.1 Early Access: Core Simulation

Purpose: prove engine loop, determinism, events, explanation, and headless execution.

Systems:

- Time.
- Scheduler.
- Entity IDs.
- Commands.
- Events.
- Basic state store.
- Seeded random streams.
- Headless runner.
- Minimal save/load.
- Basic visual debug text output or simple inspector projection.

Exit criteria:

- Same scenario with same seed produces same event sequence.
- A simple event can explain direct cause and affected state.
- Simulation runs without UI.

### v0.2 World

Purpose: create spatial and resource context.

Systems:

- Regions.
- Settlements.
- Terrain/resource nodes.
- Distance and travel costs.
- Basic environment.
- Resource availability.
- World statistics.

Exit criteria:

- Citizens and economies can later reference stable places, resources, and movement costs.
- World can be serialized, loaded, inspected, and replayed.

### v0.3 Economy

Purpose: simulate production, consumption, scarcity, and work.

Systems:

- Goods.
- Food.
- Jobs.
- Production chains.
- Storage.
- Local markets.
- Prices or scarcity signals.
- Basic trade routes.

Exit criteria:

- Food shortages emerge from production, transport, labor, or storage constraints.
- Economy events explain causes using structured factors.

### v0.4 Society

Purpose: add people, households, needs, demographics, and social structure.

Systems:

- Citizens.
- Families.
- Households.
- Housing.
- Needs.
- Birth/death basics.
- Social class or status.
- Local trust/unrest signals.

Exit criteria:

- Individuals and families react to economy and housing conditions.
- Social outcomes can be traced back to material and institutional causes.

### v0.5 Government

Purpose: simulate authority, policy, taxes, services, law, and legitimacy.

Systems:

- Offices and rulers.
- Laws.
- Taxation.
- Public stores.
- Spending priorities.
- Legitimacy.
- Enforcement.
- Administrative capacity.

Exit criteria:

- Government decisions affect economy, society, and unrest.
- Policy outcomes are explainable through budget, law, legitimacy, and capacity.

### v0.6 Military

Purpose: introduce organized force without turning Rayxus into a combat game.

Systems:

- Recruitment.
- Units.
- Supply.
- Morale.
- Training.
- Defense.
- Internal security.
- Battle resolution at abstract scale.

Exit criteria:

- Military strength depends on population, economy, logistics, leadership, morale, and terrain.
- Conflicts produce historical records and causal explanations.

### v0.7 Diplomacy

Purpose: simulate relationships between polities.

Systems:

- Factions and kingdoms.
- Treaties.
- Trade agreements.
- Threat perception.
- Reputation.
- Grievances.
- Alliances.
- War and peace decisions.

Exit criteria:

- Diplomatic decisions emerge from interests, history, power, economy, and ideology.
- AI Inspector can explain why a faction chose peace, trade, sanctions, or war.

### v0.8 History

Purpose: make Rayxus inspectable across time.

Systems:

- Historical timeline.
- Event search.
- Causality graph.
- Replay.
- Time Machine.
- Statistics archive.
- Historical summaries.

Exit criteria:

- User can inspect major historical changes and trace causes backward.
- Replay can reproduce or branch selected scenarios within known constraints.

### v0.9 Optimization and Platform Hardening

Purpose: prepare engine for serious scale and external use.

Systems:

- Profiling.
- Worker execution.
- LOD simulation.
- Snapshot compaction.
- Schema migrations.
- Plugin stability.
- Storage performance.
- Dedicated server readiness.

Exit criteria:

- Engine supports larger populations through aggregation and active-region detail.
- Performance limits are measured and documented.

### v1.0 Stable Release

Purpose: stable engine release for building serious applications.

Systems:

- Stable public module APIs.
- Stable save format versioning.
- Plugin SDK.
- Modding SDK.
- Documentation.
- Test suites.
- Example scenarios.
- Studio/debug tooling.

Exit criteria:

- Third-party project can use Rayxus core without depending on internal app code.
- Saves, plugins, scenarios, and replay files have clear compatibility policy.

## 9. Major Systems

### Time

Primary pillar: Engine  
Secondary pillars: World, History

Time should be discrete, deterministic, and multi-scale. The kernel should support ticks, days, seasons, years, and scheduled events. Domain modules should not directly own time progression.

Recommendation:

- Use fixed simulation ticks for deterministic processing.
- Expose calendar projections for human-readable history.
- Allow systems to run at different cadences, such as daily needs, seasonal harvests, yearly tax cycles, and event-driven diplomacy.

Trade-off:

- Fine ticks improve detail but increase cost.
- Coarse ticks scale better but hide causality.
- Recommendation is multi-rate scheduling controlled by the kernel.

### Citizens

Primary pillar: Life  
Secondary pillars: Economy, Society, Intelligence

Citizens should be simulated as agents with identity, household links, needs, skills, roles, location, and memory summaries. Not every citizen needs full decision depth at all times.

Recommendation:

- Use full agents in active simulation areas.
- Use aggregated cohorts for distant or low-priority populations.
- Preserve identity for historically important people.

Key risk:

- Individual simulation can destroy performance. LOD population modeling must be part of architecture before scale increases.

### Families and Households

Primary pillar: Life  
Secondary pillars: Society, History

Families should act as social and economic units. Households are more important for economics than biological family alone.

Responsibilities:

- Births, deaths, marriage or partnership rules.
- Dependency and caregiving.
- Household consumption.
- Housing occupancy.
- Inheritance and social status later.

Recommendation:

- Model household as economic unit.
- Model family/kinship as social relation graph.

### Economy

Primary pillar: Economy  
Secondary pillars: Society, Intelligence

Economy should model resource flows and scarcity before complex finance.

Initial scope:

- Goods.
- Food.
- Labor.
- Production sites.
- Storage.
- Consumption.
- Scarcity signals.
- Local exchange.

Delay:

- Detailed banking.
- Speculative markets.
- Advanced currency mechanics.
- Full enterprise simulation.

Reason:

Foundational material economy must work before abstract institutions become meaningful.

### Food

Primary pillar: Economy  
Secondary pillars: World, Life

Food should be the first serious economic stress test.

Responsibilities:

- Production by region and season.
- Storage and spoilage.
- Household consumption.
- Trade and shortage.
- Starvation, unrest, migration pressure.

Explanation requirement:

Food shortage events must distinguish low production, labor shortage, transport failure, storage loss, bad policy, conflict disruption, and unequal distribution.

### Jobs

Primary pillar: Economy  
Secondary pillars: Life, Society

Jobs connect citizens to production, income, status, skills, and institutions.

Recommendation:

- Start with role assignment and labor capacity.
- Add wages, contracts, guilds, and specialization later.

Trade-off:

- Fully dynamic labor markets are powerful but complex.
- Early versions should use inspectable labor allocation with scarcity pressure.

### Housing

Primary pillar: Life  
Secondary pillars: Economy, Society

Housing should affect health, family formation, migration, status, and unrest.

Responsibilities:

- Capacity.
- Quality.
- Ownership or access.
- Location.
- Cost or allocation.
- Household suitability.

Recommendation:

- Start with housing units and occupancy.
- Add property markets later after economy stabilizes.

### Government

Primary pillar: Society  
Secondary pillars: Economy, Conflict, History

Government is decision-making plus authority plus administrative capacity.

Responsibilities:

- Law.
- Taxes.
- Budgets.
- Public works.
- Emergency orders.
- Legitimacy.
- Enforcement.
- Offices and succession later.

Recommendation:

- Treat government actions as explicit commands with explainable policy goals.
- Separate institutional rules from current office holders.

### Trade

Primary pillar: Economy  
Secondary pillars: World, Diplomacy

Trade should move goods across distance under cost, risk, policy, and relationship constraints.

Initial scope:

- Route availability.
- Transport capacity.
- Price/scarcity incentives.
- Tariffs or restrictions later.

Trade-off:

- Agent-level merchants create rich stories but high complexity.
- Aggregate route flow should come first, with named trader agents later if needed.

### Military

Primary pillar: Conflict  
Secondary pillars: Government, Economy, History

Military should be a societal capability, not just combat math.

Responsibilities:

- Recruitment.
- Training.
- Equipment.
- Morale.
- Supply.
- Command.
- Internal security.
- Abstract combat resolution.

Recommendation:

- Delay tactical battle maps.
- Model logistics and social cost first.

### Diplomacy

Primary pillar: Society  
Secondary pillars: Conflict, Economy, Intelligence

Diplomacy should emerge from interests and memory.

Responsibilities:

- Relations.
- Treaties.
- Grievances.
- Trust.
- Threat assessment.
- Trade dependencies.
- War/peace reasoning.

Recommendation:

- Use explicit diplomatic state and event memory.
- Avoid black-box AI that cannot explain decisions.

### Events

Primary pillar: History  
Secondary pillars: Engine, Intelligence

Events are structured records of meaningful changes.

Event classes:

- State change events.
- Decision events.
- Crisis events.
- Relationship events.
- Summary events.
- Debug events.

Recommendation:

- Store high-value events durably.
- Summarize high-frequency events.
- Attach cause references and affected entity IDs.

### History

Primary pillar: History  
Secondary pillars: Society, Intelligence

History is not only an event log. It is a queryable interpretation layer over events, statistics, and causality.

Responsibilities:

- Timelines.
- Entity biographies.
- Settlement histories.
- Kingdom histories.
- Cause chains.
- Statistical trends.
- Branch metadata for Time Machine.

### Statistics

Primary pillar: History  
Secondary pillars: Visualization, Engine

Statistics should be projections, not authoritative state.

Responsibilities:

- Population metrics.
- Food supply.
- Employment.
- Housing pressure.
- Prices/scarcity.
- Government budget.
- Military strength.
- Diplomacy relations.

Recommendation:

- Compute short-term live stats in memory.
- Persist long-term rollups for replay and analysis.

### AI

Primary pillar: Intelligence  
Secondary pillars: Life, Society, Economy, Conflict

AI should be layered, explainable, and deterministic where possible.

Recommended layers:

- Reactive rules for urgent needs.
- Utility scoring for routine choices.
- Goal planning for institutions and factions.
- Policy evaluation for governments.
- Strategic reasoning for diplomacy and war.

LLM caution:

LLMs should not be authoritative simulation decision engines in early Rayxus. They are nondeterministic, expensive, hard to replay, and difficult to validate. They may later serve as optional explanation narrators, scenario authors, or assistant tools over structured simulation data.

### Save/Load

Primary pillar: Engine  
Secondary pillars: History

Save/load must support snapshots, event journals, schema versions, and migrations.

Storage targets:

- JSON for development and readable scenarios.
- SQLite for local applications.
- PostgreSQL for hosted and server deployments.

Recommendation:

- Keep storage behind ports.
- Never let simulation modules call database APIs.
- Version every durable schema.

### Plugins

Primary pillar: Engine  
Secondary pillars: All pillars

Plugins should extend engine behavior through declared capabilities.

Plugin types:

- Data packs: goods, jobs, laws, cultures, names, scenarios.
- Rule modules: new systems or policies.
- Projection plugins: stats and reports.
- Visualization plugins: debug views and custom inspectors.
- Storage/render/network adapters.

Recommendation:

- Start with data packs first.
- Add executable plugins only after module APIs stabilize.

Security caution:

Executable plugins need sandboxing, permissions, and compatibility rules. Treat them as a v1.0 or later maturity feature unless required earlier.

### Modding

Primary pillar: Engine  
Secondary pillars: Visualization, All domain pillars

Modding should be structured, versioned, and inspectable.

Recommendation:

- Support declarative data mods early.
- Provide schema validation and conflict reports.
- Avoid arbitrary script mods until plugin boundaries are stable.

### Replay

Primary pillar: History  
Secondary pillars: Engine, Visualization

Replay requires deterministic command processing, seed control, versioned events, and snapshot anchoring.

Recommendation:

- Replay from snapshot plus journal.
- Support replay at event level first.
- Add visual replay controls later.

### Time Machine

Primary pillar: History  
Secondary pillars: Engine, Visualization

Time Machine lets users inspect, rewind, branch, and compare simulation histories.

Recommendation:

- Start as developer/debug feature.
- Use snapshots for rewind anchors.
- Use branch IDs for alternate histories.
- Persist branch metadata separately from normal saves.

### Headless Mode

Primary pillar: Engine  
Secondary pillars: All pillars

Headless mode is mandatory in v0.1.

Responsibilities:

- Run scenarios.
- Execute tests.
- Generate reports.
- Benchmark performance.
- Support server deployment.

Rule:

Any system that cannot run headless is not part of the engine core.

### Visual Debug Mode

Primary pillar: Visualization  
Secondary pillars: Engine, History

Visual Debug Mode should expose engine internals without becoming engine logic.

Views:

- Time controls.
- Entity inspector.
- Event stream.
- Cause graph.
- Map overlays.
- Economy flow diagrams.
- AI decision traces.
- Statistics charts.

Recommendation:

- Use React/shadcn/ui for tooling shell.
- Use D3 for charts and causal graphs.
- Use WebGPU only where scale or map rendering needs it.

### AI Inspector

Primary pillar: Intelligence  
Secondary pillars: Visualization, History

AI Inspector should explain decisions in structured form.

Required views:

- Current goal.
- Candidate actions.
- Utility scores or planner costs.
- Constraints.
- Memory facts used.
- Policy weights.
- Random seed influence where relevant.
- Resulting event.

Rule:

If AI cannot explain a major decision, the decision model is not ready for stable release.

## 10. UI Philosophy

Rayxus UI should be a professional engine studio and simulation workbench, not a marketing site and not a game interface.

UI goals:

- Inspect simulation state.
- Control time.
- Compare histories.
- Debug modules.
- Edit scenarios.
- Visualize cause and effect.
- Help developers, designers, researchers, and educators understand the engine.

Recommended stack:

- React for application UI.
- TypeScript for shared types.
- Tailwind and shadcn/ui for consistent controls.
- D3 for charts, graphs, timelines, and relationship visualization.
- WebGPU for high-scale maps, overlays, and dense visual simulations.

Boundary rule:

UI may send commands and display projections. UI must not directly mutate simulation state.

## 11. Engine Philosophy

Rayxus should be designed as a long-lived platform.

Engine rules:

- Favor explicit contracts over hidden coupling.
- Keep domain rules inspectable.
- Preserve simulation authority inside core runtime.
- Make state serializable and diffable.
- Build replay and explanation into every major system.
- Treat performance as architecture, not late optimization.
- Design scale through aggregation, LOD, and partitioning rather than pretending every person on a planet can always be simulated at full detail.

### Challenged Assumptions

`Everything data-driven` can become a trap. If every rule is external config, behavior becomes hard to debug. Rayxus should be data-driven for content, parameters, scenarios, balancing, and plugin extension. Core invariants and critical algorithms should remain typed and tested.

`TypeScript everywhere` is excellent for portability, but not enough for 10-year scale alone. The architecture should reserve an escape hatch for WASM or native services behind ports.

`WebGPU` is valuable for visualization, but it must never shape the simulation model. Rendering should consume projections, not define world state.

`Database independence` does not mean storage is an afterthought. Save format, event journal, migrations, and snapshot strategy need early design before multiple adapters are built.

`AI` should not mean opaque intelligence. Rayxus needs explainable decision systems first. Black-box models can assist later, but should not control authoritative simulation in early versions.

## 12. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Agent explosion | Simulation becomes too slow | LOD, cohorts, active regions, profiling from v0.1 |
| Causality added late | Explanations become shallow or fake | Event and explanation model in v0.1 |
| UI drives architecture | Engine becomes app-specific | Headless runner and ports first |
| Storage coupling | Hard to support browser/local/server modes | Storage ports and schema package |
| Plugin instability | Mods break every release | Data packs first, executable plugins later |
| Feature creep | Shallow systems, no stable core | Version gates and exit criteria |
| Determinism failures | Replay and tests become unreliable | Seeded random streams, golden tests |
| Schema migration burden | Saves become fragile | Versioned schemas from first durable save |
| AI opacity | Decisions cannot be trusted | AI Inspector, decision traces, rule constraints |
| Planetary ambition too early | Core never stabilizes | Kingdom-scale architecture first, planetary LOD later |

## 13. Future Expansion

Future systems should be added only after core modules prove stable.

Candidate expansions:

- Climate and ecology.
- Disease and public health.
- Religion and ideology.
- Language and culture drift.
- Education and knowledge systems.
- Technology and invention.
- Law courts and bureaucracy.
- Migration and diaspora.
- Crime and corruption.
- Espionage.
- Planetary scale simulation.
- Distributed cloud simulation.
- Multi-user collaborative simulation studio.
- Scientific calibration tools.
- Educational scenario authoring.
- External AI assistant over simulation history.

Expansion rule:

New systems must connect through existing pillars, events, schemas, and explanation contracts. If a feature requires bypassing those, architecture should be revisited before implementation.

## 14. Design Decisions

### Decision 1: TypeScript Core

Recommendation: use TypeScript for core and modules.

Reason:

- Best match for browser/server portability and current frontend direction.
- Strong ecosystem for tooling.
- Shared schemas improve plugin and UI integration.

Accepted cost:

- May need WASM or native acceleration later.

### Decision 2: Hexagonal Architecture

Recommendation: use ports and adapters.

Reason:

- Keeps simulation independent from UI, storage, rendering, networking, and deployment.
- Supports JSON, SQLite, PostgreSQL, browser, server, and cloud without forking core.

Accepted cost:

- More upfront architecture and contract discipline.

### Decision 3: Hybrid Entity/Component Domain State

Recommendation: stable IDs plus component-like records plus domain systems.

Reason:

- More serializable and inspectable than object-heavy design.
- More understandable than pure ECS for civilization concepts.

Accepted cost:

- Requires clear ownership of components and write permissions.

### Decision 4: Event Journal plus Snapshots

Recommendation: hybrid persistence.

Reason:

- Supports save/load, replay, Time Machine, statistics, and causality without pure event-sourcing complexity.

Accepted cost:

- Requires schema versioning and compaction strategy.

### Decision 5: Headless First

Recommendation: v0.1 must run without UI.

Reason:

- Validates simulation-first principle.
- Enables tests, benchmarks, servers, and scientific use.

Accepted cost:

- Early progress may look less visually impressive.

### Decision 6: Explanation First

Recommendation: every major event and AI decision emits structured explanation data.

Reason:

- "Why" is a core product promise.
- Retrofitting causality later is expensive and often ineffective.

Accepted cost:

- Slight overhead in event design and system implementation.

### Decision 7: Data Packs Before Executable Plugins

Recommendation: support declarative mods before code plugins.

Reason:

- Safer, easier to validate, easier to keep compatible.
- Lets content expand before plugin runtime complexity.

Accepted cost:

- Less early power for advanced mod authors.

### Decision 8: Aggregate Distant Simulation

Recommendation: use simulation LOD from early architecture.

Reason:

- Believable kingdoms and planets require scale beyond full individual simulation.

Accepted cost:

- Requires careful transitions between individual and aggregate representations.

## 15. Recommended Development Order

1. Finalize architecture vocabulary and ADR templates.
2. Define package boundaries and dependency rules.
3. Define durable schema versioning strategy.
4. Design core time, scheduler, command, event, random, and explanation contracts.
5. Build headless runner with one minimal smoke scenario.
6. Add golden deterministic replay tests.
7. Add first save/load adapter using JSON.
8. Add world module with regions, resources, settlements, and distance.
9. Add economy module focused on food, labor, storage, and scarcity.
10. Add society module with citizens, households, housing, needs, and demographics.
11. Add minimal visual debugger as projection consumer.
12. Add SQLite adapter for local persistence.
13. Add government module.
14. Add military module.
15. Add diplomacy module.
16. Add history, replay, Time Machine, and event search.
17. Add PostgreSQL/server adapter.
18. Add plugin and modding SDK after core APIs stabilize.
19. Optimize with profiling, workers, LOD, and snapshot compaction.
20. Prepare v1.0 compatibility policy and external documentation.

## 16. Immediate Next Decisions

Before coding, Rayxus should resolve these questions:

1. What population scale must v0.1, v0.4, and v1.0 support?
2. Should v0.1 prioritize deterministic replay as a hard requirement or as a best-effort target?
3. How detailed should citizens be before aggregate cohorts take over?
4. What is the first canonical scenario: village, town, city-state, or small kingdom?
5. Should storage schemas be optimized first for human readability, long-term migration, or performance?
6. What minimum explanation format counts as acceptable for v0.1?
7. Which APIs are internal-only until v1.0, and which can be treated as public earlier?

Recommended answers for initial planning:

- v0.1 target: hundreds to low thousands of entities.
- v0.4 target: one settlement with thousands of citizens through mixed individual/cohort modeling.
- v1.0 target: multiple settlements and one small kingdom at useful speed.
- First canonical scenario: isolated agrarian valley with one settlement, one food economy, simple households, and seasonal stress.
- v0.1 determinism: hard requirement for same runtime and same version.
- v0.1 explanation: direct cause, affected entities, state deltas, and contributing factors for major events.

## 17. Definition of Architectural Success

Rayxus architecture is successful when:

- A simulation can run headless.
- A browser UI can inspect the same simulation without owning its logic.
- A save can be loaded through JSON locally and later through SQLite/PostgreSQL without changing domain modules.
- A major event can explain why it happened.
- A replay can reproduce a scenario from seed, commands, snapshots, and event journal.
- A new domain module can be added without rewriting the kernel.
- A visualization can be replaced without changing simulation code.
- Scaling strategy is explicit before planetary ambition begins.

Rayxus should earn complexity. Each version should deepen the engine foundation rather than widen the feature list faster than the architecture can support.
