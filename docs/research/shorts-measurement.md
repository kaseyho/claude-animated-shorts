# Measuring whether a Short earns attention

Evidence checked on 5 November 2026. This guide uses official YouTube and TikTok documentation. It separates platform definitions from the repository's proposed evaluation procedure. No private channel analytics were accessed, and the current data-centre video has not been audience-tested in this work.

## Public popularity is a sampling signal

A large public view count makes a video worth studying; it does not reveal how well its opening retained viewers, why it reached them, or whether a particular caption treatment caused its success. Record the count, count type, observation date and publication age alongside each reference. A displayed like count is not a view count, and one exceptional upload is not evidence of a channel's typical result.

YouTube changed Shorts views on **31 March 2025** to count starts and replays without a minimum viewing duration, retaining the earlier measure as engaged views. [TeamYouTube announcement, 26 March 2025](https://support.google.com/youtube/thread/333869549?hl=en&msgid=342191247)

The current official explanation, published **19 August 2026**, says first-frame counting expands across formats from 24 August 2026, while most analytics remain anchored to engaged views. Date-stamp any comparison across these measurement changes rather than treating old and new public totals as identical measures of attention. [YouTube's current engaged-view explanation](https://blog.youtube/inside-youtube/engaged-views-youtube-explained/)

## Separate the decision to stay from the ability to hold attention

These are YouTube's Shorts definitions. Its unspecified “initial seconds” should not be replaced with an invented cutoff. [YouTube content-performance metrics](https://support.google.com/youtube/answer/12220281?hl=en)

| Metric | Meaning | Editing question |
|---|---|---|
| Views | Playback starts; replay starts can contribute. | How much exposure accumulated? |
| Engaged views | Plays continuing beyond the initial seconds, excluding loops. | How many occasions progressed past the opening? |
| Stayed to watch | Share continuing beyond the initial seconds. | Did the opening earn attention? |
| Average view duration (AVD) | Average watched time among those who stayed, using engaged views and corresponding watch time. | Did the body hold this group? |
| Average percentage viewed (APV) | Average share watched among those who stayed. | How much of this duration did that group watch? |
| Traffic source | Feed, search, channel pages, external and other sources. | Are viewing contexts comparable? |

Interpretation: assess opening and body together. A small audience can stay longer than a large one. Compare seconds and percentages across different durations. Neither APV nor engaged/public-view division is a count of unique people completing the film or a substitute for the reported stayed-to-watch metric.

## Read the curve against the edit

Audience-retention data normally takes **1–2 days** to process. YouTube describes dips as points where viewers leave or skip, and spikes as places receiving extra viewing, rewatching or sharing; a spike may also mean the explanation was unclear. Review the actual moment before assigning a cause. Automatic key-moment labels are not guaranteed, and the help page gives a minimum of 60 seconds and 100 views for those highlighted moments. Their absence is not a failure signal for a shorter Short. [YouTube audience-retention guidance](https://support.google.com/youtube/answer/9314415?hl=en)

Use this beat-level log when a report is available:

| Time / frames | Intended viewer question | What changes in picture, voice or text | Observed curve change | Plausible explanation | Next edit to test |
|---|---|---|---|---|---|
| Opening | Why should I care? | First image and first spoken claim | Record, do not predict | Confusing subject, weak stakes, or audience mismatch | Change one opening mechanism |
| First explanation | How does that happen? | Mechanism or demonstration begins | Record | Too many terms, repetition, or weak visual evidence | Simplify that explanation |
| Escalation | What changes the situation? | New constraint or consequence | Record | New stakes helped; or the transition obscured meaning | Test one clearer visual consequence |
| Payoff | Did the promise get answered? | Result, reveal or explanation resolves | Record | Useful resolution; or the answer arrived too late | Move proof earlier without removing context |
| Ending | Is there a reason to continue or rewatch? | Final consequence or natural callback | Record | Completion, replay, confusion, or dead space | Shorten dead space; keep the answer intact |

Those explanations are hypotheses. A dip at a caption transition does not establish that the font caused it. Watch the audio, image, claim and audience context at the same timestamp. A visually seamless loop is a possible editing choice, not proof of satisfaction; an unresolved promise should not be disguised as a loop.

## There is no single published “viral score”

YouTube says Shorts ranking considers the choice to view, viewing duration and percentage watched, plus enjoyment signals such as likes and post-watch surveys. It also describes topic demand, competing videos, seasonality and viewer personalization. Good metrics can therefore coexist with fewer impressions when other videos perform better for those viewers. It does not favor a particular Shorts format or require a minimum posting cadence. [YouTube Shorts search and discovery guidance](https://support.google.com/youtube/answer/11914225?co=YOUTUBE._YTVideoType%3Dshorts&hl=en)

The practical implication is to improve against the channel's own comparable work. Avoid declaring that “80% stayed to watch,” “100% APV,” a fixed edit frequency, or a particular upload hour guarantees distribution. The official evidence cited here does not establish such thresholds.

## A small evaluation plan for this repo

This is a proposed production experiment, not a platform rule or a completed test. Use it when publishing is separately authorized.

1. **Choose one hypothesis.** Example: showing a visible consequence before the abstract topic will improve the opening without reducing comprehension.
2. **Prepare two opening approaches.** A: immediate visible consequence. B: an unusual question followed by evidence. Keep the claim accurate, narration natural, caption legibility and delivery quality comparable. A hook must promise an answer the rest of the film actually supplies.
3. **Use two matched topic pairs across four original Shorts.** Alternate the approaches instead of assigning every stronger topic to one treatment. Keep duration and audience intent reasonably close. Organic distribution is not randomized; call this a directional comparison, not a clean causal A/B test.
4. **Choose the review windows in advance.** For this workflow, capture snapshots at 48 hours and seven days after publication. These are consistent bookkeeping choices, not claims about when recommendation systems finish evaluating a Short. If reports are still unavailable or exposure is too sparse to interpret, record “inconclusive.”
5. **Compare against a relevant baseline.** Use available recent uploads with similar format, topic and duration. Record how they were selected; do not silently compare a new explainer with an unrelated viral comedy outlier.
6. **Read opening and body measures together.** Record stayed-to-watch, AVD, APV, engaged views, traffic-source mix and the key curve timestamps. Review comments for misunderstanding or unmet promises. Raw likes and public views are context, not an isolated verdict on an edit.
7. **Decide one next change.** Keep a treatment when the directional result repeats and comprehension remains intact. If measures conflict, explain the tradeoff and inspect the corresponding scene. Do not rewrite the entire style after one upload.

Copy this record for each experiment:

```text
Experiment ID / date:
Hypothesis:
Primary question: opening / explanation / payoff / replay
Reference mechanism being adapted:
What stays comparable:
What changes:
Upload URLs and publish times:
Duration and topic for each upload:
Baseline uploads and selection rule:
Observation window / analytics retrieval time:
Views and engaged views (separate fields):
Stayed to watch:
AVD seconds / APV:
Traffic-source mix:
Relevant retention timestamps:
Evidence of comprehension or confusion:
Differences in audience, topic or exposure:
Conclusion: promising / mixed / inconclusive
Next single change:
```

## Format and safe placement

For standard YouTube channels, square or vertical uploads of up to three minutes uploaded on or after 15 October 2024 are categorized as Shorts. The repo's 72-second portrait example is within that format; the limit is not a recommended target length. Let the promised explanation determine how much time is needed. [YouTube three-minute Shorts eligibility](https://support.google.com/youtube/answer/15424877?hl=en)

YouTube's editing guides show where interface elements and descriptions may obscure text, and flag unsafe edges. Validate the finished caption box in the actual target player/editor as well as a phone-sized render. The repo's fixed margins are working layout choices, not universal safe-zone dimensions for every device. [YouTube visual guides](https://support.google.com/youtube/answer/16215842?hl=en)

TikTok's performance-ad guidance supports vertical 9:16, sound, UI-safe content, early hooks and continued creative testing. It recommends introducing an ad's proposition within three seconds and prioritizing the hook within six. These are advertising recommendations, not measured universal deadlines for an organic animated explainer. Use them to generate experiments rather than forcing a natural voice into a faster delivery. [TikTok creative best practices, updated June 2025](https://ads.tiktok.com/resources/help/article/creative-best-practices?lang=en)

## What this research can establish before publication

The repository can verify that a hook is understandable, the promised answer exists, all spoken subtitles are accurate, words fit on a phone screen, narration remains natural, audio and motion are technically clean, and reference observations are traceable. Only an audience test can establish whether the resulting creative performs better for this channel. Preserve both kinds of evidence instead of labelling an untested render “viral.”
