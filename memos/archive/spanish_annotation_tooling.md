---
type: draft
tags:
  - asr
  - spanish
  - dataset_creation
  - annotation
---
## Long version

Hello team,

[[Till Poppels]] and I wanted to check in on the possible annotation pipelines for the Spanish ASR test set. As we see it, there are three potential environments the pipeline could be housed in, namely:

1. **Google drive:** Transcriptions could be stored and edited in Google sheets, audio could be provisioned through Google drive's internal audio player.
2. **Personal dev server:** (*if* the annotators have one or are willing to set it up) data can be pulled as-needed from s3 and persisted on the dev server for the duration of an annotation session, then put back to s3.
3. **Director app (via Speechlab):** Set up a security-compliant interface for provisioning audio and updating transcriptions.

Considering that an annotation pipeline must both *handle annotation input* and *provision audio*, we obtain the following possible configurations:

1. **Google drive-only annotation:** Contractors write updated transcriptions in a Google Sheets file and play audio using Google drive internal audio player.
	- **Pro:** Low cost to set up, no need to create an interface.
	- **Con:** *High* annotation friction: contractor must open audio in a separate tab or window, no audio scrubbing, no visual indication of message timestamps in audio stream.
	- **Con:** Audio data persists *long-term in Google drive*. Not sure what compliance policies are for storing audio in Google, but this doesn't seem ideal compared to other alternatives where audio is only loaded in-memory during an annotation session and is not persisted outside of s3.
2. **Google sheets annotation + audio provisioning interface:** Google sheets used for storing transcriptions, and annotators use a visual interface to access audio.
	- **Pro:** Can implement audio scrubbing, visual message timestamps etc. to reduce annotation friction.
	- **Pro:** Audio only persisted in s3.
	- **Con:**  Either annotators need to have access to a personal dev server or need to go through the process of setting up a security-compliant app through Director. 
3. **End-to-end annotation interface:**  Unified interface to provision audio and transcriptions from s3 and write new transcriptions to s3.
	- **Pro:**  Potentially lowest friction option as transcriptions and audio are provisioned in the same interface.
	- **Pro:** No data persisted outside of s3.
	- **Con:** Same as above. Either annotators have dev server or create Director app through Speechlab.

 I've created a sample unified interface that I can access through my dev server. It handles loading audio and transcription data in memory from s3 to a temporary file so that data is destroyed at the end of a session. Currently updated transcriptions are written to a local JSON file but they can be written to s3 directly in the future. Screenshots below. See also the [github repo](https://github.com/mark-jo-sim/spanish-annotation-demo) and linear ticket I18-23.

![[spanish_annotation_tool.png]]

Open questions:

1. [[Lavinia Petrache]] Are we willing to stick with contractor annotators that have a personal dev server set up, or guide annotators through this process? And is doing so in compliance with security guidelines?
2. [[Dong Zhao]] [[Lily Tao]] [[Qinbang Xiao]] Ticket I18-10 was cancelled, and as far as I'm aware the Speech Lab team has had its hands full with ASR and TTS evaluations, and so the annotation tool has been postponed to Q3. Does this mean that a director app is off the table for the Spanish annotation contractors?

## Short version

Hi Lavinia,

Till and I have made some progress planning the annotation interface for the Spanish contractors. I made a quick vibe-coded interface that runs on my dev server and loads data from S3 and loads of data into memory (I've attached the screenshot below). The app provides several friction-reducing components like audio scrubbing and color-coding of message turns in the audio playback interface, and it automatically deletes audio data from the local machine  once annotations are submitted for a conversation.

 I know Speech Lab has its hands full and doesn't plan to get an annotation interface into Director by the end of Q2, so if an internally hosted app is off the table, then our two options are:

1. Google Drive only annotation
2. They can use a similar tool to what I've created either run from their laptop or on a dev server 

Google Drive only annotation will have huge friction. The annotators will have to play audio segments from Google Drive directly and will not have access to any audio scrubbing, they'll have to have one spreadsheet open with their transcriptions and a different tab or window open to load audio. Plus we'd be storing the audio files on Google Drive long-term and I'm not sure what the security implications of that are.

So since a Director-hosted tool is not feasible at the moment, I think we should consider using an interface that runs either on a laptop or on a dev server. I'm not entirely sure what the security protocol is for either of those or if the annotators have access to a dev server.

## Even shorter version

Hi Lavinia,

I wanted to check in re: annotation interface for Spanish contractors. My understanding is that due to friction with creating a security-compliant app for Director, we've decided to stick with spreadsheet-based annotation. Does this mean audio would be provisioned through Google drive as well? If so, that would be very high-friction: no audio scrubbing + need to load audio for each conversation manually. Also audio needs to live long-term on google drive–is this security compliant?

Another option we discussed is to use a lightweight app on a dev server or locally if deploying to Director is too big an ask. I vibe-coded a quick interface that fetches audio from s3 and persists it on disk until the annotation is submitted, screenshot attached. This raises the question of whether the contractors will or could have access to a dev server to run it, or if it would be security-compliant to run this locally as long as data is destroyed at the end of annotation.

Let me know what you think of these options, and whether I should loop in the Qinbang, Lily or Dong, or if we should wait till our next sync on Monday to bring this up. Thanks!

## Resolution

Director already provides an interface for viewing and scrubbing conversation audio. This will be used in conjunction with spreadsheet-based text input. 