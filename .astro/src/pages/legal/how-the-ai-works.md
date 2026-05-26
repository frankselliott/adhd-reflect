---
layout: ../../layouts/Legal.astro
title: How the AI Works
label: Transparency
description: How ADHD Reflect uses AI to match you with the right card.
updated: 25 May 2026
---

# How the AI works

**Last updated: 25 May 2026**

## The short version

The in-the-moment assistant on ADHD Reflect is a **matcher**, not a chatbot. You type or speak what just happened. The assistant finds the card or guide on our site that fits it best.

The AI does not write advice. It does not invent answers. Everything you read on the site has been **written by a person and reviewed by us**.

We use **Anthropic's Claude** (a large language model) for the matching step. The text you type is sent to Anthropic to do that match. We do not store your raw text by default, and Anthropic does not use it to train their models.

---

## What the assistant actually does

You type something like:

> "I just yelled at my kid because they wouldn't put their shoes on."

Behind the scenes:

1. Your text is sent to Claude, along with a list of every card and guide we have written.
2. Claude picks the best match (or a short list of likely matches).
3. We show you the **pre-written card or guide**.
4. The card or guide you read was written and reviewed by us, not by Claude.

You can think of Claude as a **smarter search bar**. It understands what you mean, even when you do not use the exact words on the site. It does not make anything up to show you.

---

## Why we built it this way

We did not want a chatbot that "talks to you" about hard parenting moments. That kind of system can:

- give you slightly different advice every time, depending on how a model is feeling that day;
- produce confident-sounding text that is not grounded in anything you can check;
- drift into territory it is not safe in (medication, diagnosis, crisis advice);
- accidentally make a moment worse by saying the wrong thing.

A retrieval system, where the AI only points you to **content we wrote on purpose**, is more honest and easier to trust. If a card needs to change, we change it once and everyone sees the updated version.

The trade-off is that the assistant can only show you something we have already written. If your situation is not in the library yet, you will see a "we have not written this one yet" message, with a chance to tell us what is going on. That is how we decide what to write next.

---

## What we send to Anthropic

Each time you use the assistant, we send Anthropic the following:

- the text you typed or spoke;
- the list of cards and guides currently on the site (so it knows what to match to);
- general instructions about how to do the matching.

We do **not** send Anthropic your name, email address, account ID, location or payment details.

---

## What Anthropic does with it

Anthropic processes your text to return a match. Per Anthropic's published API terms:

- API inputs are not used to train Anthropic's models by default, and we have not opted in to any training programmes;
- inputs are retained for a short period for abuse-detection and safety, then deleted;
- Anthropic's servers used for the API are based in the United States.

If you want to read it directly, see [Anthropic's commercial terms and privacy policy](https://www.anthropic.com/legal).

---

## What we log on our side

By default, when you use the assistant, we log:

- which card or guide you were matched to (an ID like `card_yelled_homework`);
- a general category (such as "yelling", "transitions", "homework refusal");
- whether you opened the card or guide that was shown;
- the time of day, in aggregate.

We do **not** log the raw text you typed.

### One exception: unmatched queries

If the assistant cannot find a good match for what you said, we will ask you:

> "Do you want to help us write a guide for this? We will keep your words so we can use them when we write it."

If you tick the box, we keep your text for up to **six months** to inform what we write next. We do not link it to your email, your account or your payment details. If we publish a new card or guide that came from your query, we do not credit it back to anyone in particular.

If you do not tick the box, the assistant still helps you, and we still show you the closest options. We just do not keep what you typed.

---

## Voice input

If you tap the voice button instead of typing, your browser uses the **Web Speech API** to convert your speech to text **on your device**. The audio does not leave your phone or computer. We only ever see the text version, just as if you had typed it.

Voice input does not work in every browser. If you are using Firefox, or the in-app browser inside Instagram, Facebook or some other apps, you will not see the voice button. Type instead.

---

## Crisis detection

The assistant runs a quick check on what you type, looking for language that suggests serious safety risk to you, your child or someone else.

If the check picks something up, the assistant **does not try to match a card**. It shows you crisis support options for your country instead. This is hard-coded, not generated. You will see:

- the emergency number for your country;
- the main crisis support line;
- a clear note that ADHD Reflect is not a crisis service.

A crisis check is not perfect. It is meant as an extra safety net, not a substitute for getting help. If you are in danger, contact emergency services. Our [Important safety information](/important-safety-information) page has more options.

---

## What we will never do with what you type

We will never:

- send what you type to advertisers, marketers or referral partners;
- use what you type to choose which paid services to recommend to you;
- tie what you type to your social media accounts;
- use what you type to retarget you with ads anywhere else on the internet;
- sell what you type, in raw form or any other form.

If we ever change one of these, we will say so loudly, not bury it in an update.

---

## Honest limits of the assistant

The assistant is good at:

- recognising the everyday moments parents describe;
- ignoring small differences in wording;
- showing you a card or guide that is genuinely about what you said.

The assistant is not good at:

- conversations (it does not chat);
- clinical questions (it will not diagnose anything);
- specific advice for your specific child (we do not know your child);
- predicting what will happen if you do or do not try something;
- replacing a professional.

If you are not happy with a match, you can scroll the result list, browse the library, or tell us the match was off. We use that to improve the matching.

---

## Questions

If you have questions about how the assistant works, what we send to Anthropic or what we log, email **privacy@adhdreflect.com** and we will answer plainly.
