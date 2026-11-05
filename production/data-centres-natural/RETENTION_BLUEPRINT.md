# Data-centre short: worked retention blueprint

**Status: proposed editorial application, not rendered.** This applies the [Shorts playbook](../../docs/shorts-playbook.md) to the existing topic. It does not replace the current 161-word narration, 72.23-second timeline, 50 subtitle cues or boxed-caption video. No audience-retention result is claimed. Use the [measurement guide](../../docs/research/shorts-measurement.md) after a future publication.

## Promise and story question

**Viewer:** someone who uses digital services but has not considered the physical infrastructure near homes.

**Promise:** explain why some communities question rapid data-centre development and what a better local arrangement could address.

**Open question:** if the benefits are widely shared, why can the building itself become a local dispute?

**Payoff:** the facility has local resource, noise and cost questions; useful services and investment do not remove the need for transparent information, fair arrangements and early resident involvement. The safeguards are editorial proposals, not a claim that a specific legal requirement already exists.

The current film already contains the necessary ingredients. The proposed change is to connect them through one resident's evolving question, so power, water, noise and benefits contribute to an answer rather than feeling like independent list items.

## Three original opening alternatives

| Option | Opening picture/action | Spoken hook | Promise to fulfil |
|---|---|---|---|
| A: invisible service, physical place | Start with a resident using a phone; reveal the facility immediately behind their street. | “The cloud needs real buildings. So why are some neighbours pushing back?” | Explain the local reasons without implying universal opposition. |
| B: useful object, disputed neighbour | Show a useful app action and the facility in the same frame, then a resident turning toward it. | “This building could help run your favourite app—and start a neighbourhood argument.” | Explain both the useful service and the local disagreement. |
| C: who participates | Begin at the planning table with a facility model, then reveal the residents around it. | “A data centre moves in. Who gets the benefits—and who gets a say?” | Explain the benefits and the proposed role for residents in the decision. |

**First hypothesis to develop: A.** It preserves the existing cloud-to-neighbour contrast, states the central question directly and can reuse the current phone, resident and factory assets. This is an editorial choice, not a conclusion from a measured A/B test.

## Approximate beat plan

These are rough planning windows for a possible new take of about a minute. They are **not** measured voice timestamps, fixed retention rules or edits to the existing composition. Write and record the final script naturally, then rebuild the actual timeline. A longer clear take is preferable to compressing speech to fit this outline.

| Rough window | Viewer question and new information | Proposed picture change | Connection to next beat |
|---|---|---|---|
| 0–5 s | Why would a useful digital service cause a local argument? | Phone action and facility share the opening frame; a resident notices its physical proximity. | The “cloud” occupies real land and infrastructure. |
| 5–11 s | What does this building need from its surroundings? | Connect the facility to the existing grid, cooling and street context. Keep one clear focal action. | Resource demand makes the shared infrastructure question concrete. |
| 11–23 s | Can the grid cope, and how are new costs allocated? | Server racks and power symbols show the existing IEA forecast; then reframe to a line serving homes and the facility. | Preserve the forecast attribution and years, then ask the cost question rather than announcing a household bill increase. |
| 23–35 s | What would neighbours experience locally? | Follow the resident past the cooling system and near the equipment. Use the existing water and sound-wave illustrations with clear spatial relationships. | Water use depends on design/location; noise is a concern that residents may raise, not proof of harm everywhere. |
| 35–44 s | Are communities actually asking these questions? | Residents bring resource questions to a shared planning table. Present the cited Mexico and South Africa examples with their limits. | Requests for clearer answers turn the concern into an accountability question. |
| 44–53 s | Why build it at all? | Return to the useful phone/service and the existing investment symbols; allow the counterpoint to register. | Benefits matter, so the answer is about the local arrangement rather than treating all development as pointless. |
| 53–64 s | What would a better arrangement address? | At the table, resolve the resource, noise and cost symbols one at a time through transparent information and resident participation. | This supplies the promised answer before the ending. |
| 64–68 s, if needed | How does this change the opening image? | Return to the same phone, resident and facility, now connected to the planning conversation. | End after the answer. An optional visual return to the first frame must not conceal or cut off the payoff. |

Avoid holding back a qualification just to create suspense. The electricity projection's meaning belongs with the number. The useful-services counterpoint belongs in the argument, not in an unreadably fast disclaimer.

These eight editorial beats can use the existing ten shots: opening/setup use shots 1–2, the grid explanation uses 3–4, water/noise use 5–6, then community, benefits, planning and callback use 7–10. Keep those scene IDs and their corresponding narration segments unless the renderer's shot mapping is deliberately changed as well. A beat is not automatically a new scene or a new audio segment.

## Editing mechanics to transfer

- **One causal thread:** return to the same resident and question as the picture expands from phone to building, infrastructure, community and decision.
- **Information-driven changes:** cut or reframe when the explanation changes. Let viewers inspect the forecast or a spatial relationship before adding another crucial detail.
- **Purposeful background activity:** preserve the populated streets and supporting residents; slow or simplify incidental movement during a mechanism explanation.
- **Captions:** retain every final spoken word. Use the current compact boxes and measured word highlights, with phrase breaks chosen after the new recording.
- **Sound:** preserve natural conversational delivery. Use specific accents for a meaningful reveal or connection, then leave room for the voice; do not add an impact to every cut.
- **Ending:** fulfil the opening question first. A callback or loop can reinforce the answer, but it is optional.

## Evidence boundaries

This blueprint reuses the project's [existing evidence notes](../data-centres/SCRIPT.md), checked there on 5 November 2026. Refresh those sources before producing a new factual version. No new factual investigation is claimed by this worked example.

| Retained point | Required boundary |
|---|---|
| IEA data-centre electricity projection, roughly doubling from 2025 to 2030 | Identify it as a projection of data-centre electricity consumption, not an observed result or a prediction that a resident's bill doubles. |
| Water use | Depends on cooling design and location; do not illustrate an inevitable empty tap, drought or reservoir loss. |
| Noise | Present the residents' concern and the relevant equipment; do not invent measured sound levels or health outcomes. |
| Mexico and South Africa examples | Specific communities' demands for information do not establish worldwide unanimity. Do not invent the current status of an application. |
| Useful services, investment and tax revenue | Retain as benefits or proponents' arguments; do not promise guaranteed local gains. |
| Proposed safeguards | Editorial recommendations, not statements of existing law. |

The neighbourhood and characters remain fictional illustrations. Adding darker lighting, damage, pollution or frightened crowds would change the implied claim and needs its own evidence.

## Production dependencies for a future implementation

The current exported video remains the baseline. Do not paste these rough times into its subtitle or animation files.

| Input/output | Current repository path | Required action if a new script is produced |
|---|---|---|
| Narration source | `production/data-centres-natural/build_audio.py` (`TEXTS`) | Replace only with the final chosen narration, then generate the new native take. |
| Measured voice and scene timings | `production/data-centres-natural/timeline.json`, `words.json` | Regenerate from the new take; word timestamps already contain the scene voice offset. |
| Animation scene boundaries | `src/videos/data-centres/natural-story.ts` | Synchronize to the new measured timeline; the audio builder does not currently regenerate this TypeScript file. |
| Caption grouping | `production/data-centres-natural/subtitle-phrases.json` | Match the complete new script exactly, then regenerate `subtitles.json` and `subtitles.srt`. |
| Narration, music and effects | `public/data-centres-natural/mix.mp3` and local audio intermediates | Rebuild the mix and recheck scene/cue placement; a new narration duration affects all timing. |
| Picture and caption treatment | `src/videos/data-centres/world.ts`, `environment.ts`, `Subtitles.tsx` | Implement the agreed beat changes; preserve the roof-flicker repair and verify moving output. |

The audio builder calls the subtitle generator, so update phrase text alongside the final narration before rebuilding. After generating audio, update `natural-story.ts`, run `npm run subtitles:data-centres`, `npm run subtitles:check` and `npm run typecheck`, then render and perform the [full subtitle/lighting checks](SUBTITLES.md).

## Evaluation hypothesis

**Hypothesis:** an immediate physical-neighbour premise and a repeated causal question will make the opening easier to understand and the middle less list-like.

Compare a future version with relevant prior uploads using the platform's actual definitions. Inspect stayed-to-watch behaviour and retention around the infrastructure explanation, counterpoint and payoff. Record length, topic, distribution and audience differences; a sequential upload comparison does not isolate editing as the sole cause. Do not infer success from extra cuts, more moving pixels or public view counts alone.
