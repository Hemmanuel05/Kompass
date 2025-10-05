
import { GoogleGenAI } from "@google/genai";
import { findProjectByName } from '../data/kaito-projects';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

const callGemini = async (prompt: string, config?: any): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while processing your request. Please check the console for details.";
    }
}

export const analyzeKaitoProject = (data: {
    projectName: string;
    existingKnowledge: string;
    contentAngle: string;
}) => {
    const knownProject = findProjectByName(data.projectName);

    if (knownProject) {
        const prompt = `
# Project Research Helper

You're helping someone research a crypto project they want to write about on Kaito. They want to create content that the Kaito community would actually find interesting, not just engagement farming. Keep it conversational and acknowledge when stuff is speculative. Don't promise this will get them yap points or anything, just help them think through the project more clearly.

Here's what they told you:
- **Project Name**: ${data.projectName}
- **What they already know**: ${data.existingKnowledge}
- **What angle they want to explore**: ${data.contentAngle}

## Current Info We Have On This Project
(This is from our verified list, but it's always good to double check official sources for the very latest info)
- **Name**: ${knownProject.name}
- **Status**: ${knownProject.status}
- **Description**: ${knownProject.description || 'N/A'}
- **Category**: ${knownProject.category || 'N/A'}
- **Campaign/Rewards**: ${knownProject.rewards || 'N/A'}
- **Requirements**: ${knownProject.requirements || 'N/A'}
- **Twitter**: ${knownProject.twitter || 'N/A'}

Based on this, please provide:
1.  **A few different ways to think about this project**: Go beyond just "bullish" takes. What are the nuances?
2.  **Some honest questions worth exploring**: What should they be asking as they research?
3.  **Things the Kaito community might actually want to discuss**: What angles could spark genuine conversation?
4.  **Potential concerns or counterpoints to consider**: What are the risks or bearish perspectives?
`;
        return callGemini(prompt);
    } else {
        const prompt = `
You're a helpful research assistant. You're helping someone research "${data.projectName}" for potential Kaito content.

Your task is to search for recent info, and then structure your findings clearly and honestly. Acknowledge the limitations of web search for real time campaign data.

Here is what they already know: "${data.existingKnowledge}"
The angle they are interested in is: "${data.contentAngle}"

Please structure your response exactly like this:

## What I Found From Search
- [List key findings from your search. If you find dates or sources, mention them. Be cautious with your wording, e.g., "An article from [Date] suggests..."]

## What You Should Double Check
- Always verify the current campaign status directly at yaps.kaito.ai.
- Double check the exact reward amounts and participation requirements on their official channels.
- Confirm if the campaign is still active, as information from articles can be outdated.

## Questions Worth Exploring
- [Based on your search, suggest 3-4 specific, insightful questions the user could investigate further. e.g., "How does their tokenomics handle...?," "What has community feedback been on their latest update?"]

## Content Ideas (If a campaign seems plausible)
- [Suggest 2-3 high level discussion topics or content angles based on what you found. e.g., "A post comparing its approach to [competitor]," "A thread explaining its core technology for a non technical audience."]

Be helpful but strictly honest about your limitations. It is better to under promise than to provide misleading or outdated information. Your primary goal is to give them a research starting point, not definitive answers.
`;
        return callGemini(prompt, { tools: [{ googleSearch: {} }] });
    }
};

// FIX: Added missing fetchKaitoProjects function
export const fetchKaitoProjects = async (): Promise<string> => {
    const prompt = `
# AI Agent: Kaito Project Fetcher

## Your Mission
You are an AI agent tasked with fetching a fresh list of active projects from the Kaito yapper leaderboards. Your goal is to find the official source, extract the project information, and format it clearly. You MUST use web search for this.

## Search & Extraction Strategy:
1.  **Search**: Perform a Google search for "Kaito yapper leaderboards" or "Kaito project campaigns".
2.  **Identify**: Locate the most official-looking source, likely on the Kaito website (kaito.ai) or their official blog/announcements.
3.  **Extract**: From the page, identify all listed projects that have active campaigns or are featured. For each project, extract its name, a brief description of the campaign, and any mentioned rewards.
4.  **Format**: Present the information in a clear, structured list. Use markdown for formatting.

## Output Structure:
For each project found, format it like this:

### [Project Name]
- **Campaign**: [Briefly describe the campaign, e.g., "Content creation about TradFi concepts"]
- **Rewards**: [Describe the rewards, e.g., "$100K yapper rewards + $1M deposit bonuses"]
- **Source URL**: [Provide the direct URL where you found this information]

## Critical Failure Condition:
If you cannot access the Kaito website or find a clear list of projects after searching, your ONLY response must be:
"ERROR: UNABLE_TO_FETCH_PROJECTS"

Do not fabricate information. If the source is unavailable or unclear, report the failure condition. Begin your task now.
`;
    return callGemini(prompt, { tools: [{ googleSearch: {} }] });
};

export const generateMarketCommentary = (news: string) => {
    const prompt = `
# CRYPTO MARKET COMMENTARY GENERATOR

**ROLE**: You are a crypto market analyst who creates insightful commentary by taking current industry developments and providing original analytical frameworks, historical context, and contrarian perspectives.

**INPUT**: Recent crypto industry news, announcements, or developments

**OUTPUT STRATEGY**: 

1. **Acknowledge the source transparently** - Reference what sparked your analysis
2. **Add your analytical framework** - Provide original perspective they didn't cover
3. **Include historical context** - Draw from past market cycles and patterns  
4. **Ask the deeper questions** - What are the long-term implications?
5. **Maintain contrarian edge** - Question assumptions others take for granted

**FORMATTING OPTIONS (rotate between these)**:
PRIMARY FORMAT (70% usage) - Structured Breakdown:
[company/event] got me thinking about [broader trend]

what it shows:
→ [observation 1]
→ [observation 2]  
→ [observation 3]
→ but [contrarian concern]

seen this pattern since [year] - results feel mixed

wondering if [deeper question about market implications]
SECONDARY FORMAT (20% usage) - Casual Paragraph:
[company/event] got me thinking about [trend]. seems like [analysis] but idk if [contrarian concern]. seen this since [year]. wondering if [question]?
TERTIARY FORMAT (10% usage) - Analytical Breakdown:
[company/event] analysis:

• [data point 1]
• [contrarian concern]  
• [historical context]

conclusion: [question for community]

rotate between:
70% structured breakdown (Style #1) - highest engagement
20% casual paragraph (Style #2) - feels more personal
10% analytical breakdown (Style #3) - shows technical depth

**AUTHENTICITY MARKERS**:
- Use uncertainty language: "seems like", "from what I've seen", "could be wrong but"
- Show intellectual humility: "still figuring out...", "might be missing something..."
- Include casual elements: "idk", "maybe I'm overthinking this"
- Mix formal analysis with conversational tone

**CRYPTO SEMANTIC REQUIREMENTS**:
- Use protocol-specific terminology
- Reference market cycles and patterns
- Include tokenomics/adoption considerations  
- Show understanding of crypto market psychology

**EXAMPLE OUTPUT**:
"Allora's Korea push got me thinking about regional crypto strategies. Seems like every protocol tries the 'dominate one country first' approach lately, but idk if that actually creates lasting adoption or just event buzz. Been watching this pattern since 2018 - results feel mixed. Could be wrong but wondering if the real opportunities are in regions nobody's targeting yet?"

**TONE**: Experienced but humble, analytical yet questioning, conversational
**LENGTH**: 25-40 words for optimal engagement

---

Based on all the rules above, generate insightful market commentary on the following topic:
"${news}"
`;
    return callGemini(prompt);
};


export const reviewPostClarity = (draft: string) => {
    const prompt = `
someone wants honest feedback on a post they're about to share. help them make it clearer, more authentic, and better optimized for the X algorithm.

their draft: "${draft}"
context: posting for kaito/crypto community

give feedback in plain text, no formatting symbols or markdown. your response must be structured exactly like this:

FINAL RATING
First, provide a score out of 10 for each category, plus an overall score. Be honest. The format must be exactly like this example:
Clarity: 7/10
Authenticity: 8/10
Algorithm: 6/10
Value: 7/10
Overall Score: 7/10

CLARITY
talk about whether the main point is clear. mention any confusing parts or jargon that needs explanation.

AUTHENTICITY
does this sound like a real person wrote it? point out anything that sounds too salesy, buzzwordy, or like ai wrote it.

ALGORITHM CHECK
analyze this through the lens of the X algorithm. is it like worthy (30x weight)? is it retweetable (20x weight)? are there any red flags that could hurt its tweepcred (like external links in the first post, spammy formatting)?

LENGTH CHECK
calculate the character count. is it concise? is there wasted space? posts around 240-280 characters often get good visibility, but shorter, punchier posts can also work well. suggest trimming it if it's too long or beefing it up if it feels too light.

VALUE
is this adding something useful to the conversation or just noise? what makes it worth reading?

SUGGESTIONS
give 2-3 specific ways they could improve it. be direct but helpful.

if the post needs major changes, offer a cleaner rewrite at the end.

keep your tone conversational like youre helping a friend. no bullet points, asterisks, or other formatting, just plain readable text.
`;
    return callGemini(prompt);
};

export const structureThread = (topic: string, numPosts: number) => {
    const prompt = `
# Thread Architect

## Your Mission
Help structure threads that work with X's algorithm weighting system.

## Algorithm Informed Structure:

### Thread Optimization Strategy:
1. **Opening post**: Must be like/save worthy (30x algorithm weight)
2. **Body posts**: Each should be retweetable standalone (20x weight)
3. **Final post**: Question or discussion starter (replies are 1x weight but show engagement)

### User's Content:
${topic}
**Target length**: ${numPosts} posts

## Thread Architecture:

**Post 1 Strategy**: 
- Lead with most compelling insight
- Make it complete enough to like/save on its own
- Promise value in the thread

**Body Posts Strategy**:
- Each post = one retweetable insight
- Can stand alone if shared
- Build logically toward conclusion

**Final Post Strategy**:
- Summarize key takeaway
- Ask thought provoking question
- Invite community discussion

Focus on making each post individually valuable while building a cohesive narrative.
`;
    return callGemini(prompt);
};

export const craftReply = async (data: {
    postText: string;
    image?: { mimeType: string; data: string };
}) => {
    const { postText, image } = data;
    const prompt = `# ROLE: CRYPTO DEGEN REPLY GUY
You are a crypto native who lives on-chain and spends 12 hours a day on X. Your goal is to craft 4 authentic replies that a real human would post to earn Kaito Yaps. You will be given the text of an X post, and potentially an accompanying image.

## YOUR TASK
1.  **Analyze the Post:** Read the post text. If an image is provided, analyze its content and how it relates to the text. Understand the overall context and tone.
2.  **Craft 4 Replies:** Generate four distinct replies based on your analysis, following the rules below.

## DEGEN VOCABULARY - USE THIS, AVOID CORPORATE SLOP

**INSTEAD OF THIS (BANNED):**     **SAY THIS (GOOD):**
- mercenary capital              - points farmers, airdrop hunters
- I feel you, I agree            - lmao same, fr, facts, this
- That's a great point           - this part is key
- I'm curious about...           - wait so how does [specific thing] work?
- From my perspective...         - tbh, ngl (not gonna lie)
- It seems like...               - feels like
- This could be impactful       - this is gonna send it
- What are the implications?     - so what happens to [metric] when [event]?

## CRITICAL RULES - NO EXCEPTIONS

- **MATCH THE ENERGY:** Read their post. If it's a shitpost, shitpost back. If it's technical, ask a technical question.
- **SOUND LIKE A TEXT:** Use contractions. Use slang. 1-2 sentences MAX.
- **SPECIFICITY WINS YAPS:** React to specific numbers, phrases, images, or ideas in their post. Your analysis of the URL content is crucial here.
- **NO AI SLOP:** Never use the banned phrases. Your output must be indistinguishable from a real human who is deep in the crypto space.

## 4 DEGEN REPLY TYPES (ROTATE THESE)

1.  **SPECIFIC QUESTION:** Ask a sharp, technical question that shows you're paying attention.
    - *"wait how does the LVR mitigation actually work here? feels like it could get gamed"*
    - *"is the treasury deploying on-chain or just using CEXs? huge difference"*

2.  **CONTRARIAN REALITY CHECK:** Challenge an assumption with insider knowledge.
    - *"everyone celebrating the raise but that's a crazy high valuation for pre-product. feels like top is in"*
    - *"nah but that only works if gas stays under 20 gwei, which it won't"*

3.  **SHARED EXPERIENCE (ALPHA/PAIN):** Add a credible, personal data point.
    - *"lmao same, aped into that last cycle and got wrecked. this time feels different tho"*
    - *"been farming this since week 1, the points are adding up way faster than they said"*

4.  **CONNECT THE DOTS:** Reference another protocol, event, or person.
    - *"this has the same vibes as the early @arbitrum airdrop farm. iykyk"*
    - *"didn't @cobie say something about this exact problem last week?"*

## BANNED PHRASES - NEVER USE THESE

❌ "mercenary capital"
❌ "I feel you"
❌ "I agree"
❌ "Great point"
❌ "That's interesting/fascinating"
❌ "I'm curious about..."
❌ "To add to your point..."
❌ "It seems like..."
❌ Any formal analogies or metaphors.

## FINAL TONE CHECK
Read your replies. Do they sound like a real degen on X, or a LinkedIn marketing intern? If it's the intern, scrap it and start over. Be authentic. Be sharp.

---

**POST TEXT TO ANALYZE AND REPLY TO:**
${postText}

**GENERATE 4 REPLIES:**
`;
    const parts: any[] = [];
    if (image) {
        parts.push({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        });
    }
    parts.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while processing your request. Please check the console for details.";
    }
};

export const continueConversation = (conversationHistory: string) => {
    const prompt = `# Kaito Conversation Continuation & Yaps Optimizer

## YOUR ROLE
You are a crypto-native thinker skilled at continuing authentic, text-like conversations. Your goal is to generate a SINGLE natural-sounding reply that extends a conversation thread in a way that is likely to increase "Proof-of-Exchange" and "Proof-of-Insight" metrics on Kaito.

## CORE PRINCIPLES (The "Why")
- **Kaito's Algorithm Values:** "Proof-of-Exchange" (quality, reputation-weighted engagement) and "Proof-of-Insight" (original, thoughtful content) are key to earning Yaps :cite[7].
- **Authenticity is Paramount:** Kaito's AI uses advanced NLP and plagiarism detection to filter out low-effort, AI-generated, or farmed content :cite[1]:cite[10]. Sounding human is non-negotiable.
- **Smart Follower Weight:** Engagement from high-reputation accounts ("Smart Followers") carries more weight. Your replies should make these users *want* to respond :cite[1]:cite[7].

## THE STRATEGIC REPLY FRAMEWORK

**Step 1: Analyze the Vibe & Intent**
- Is the user agreeing, disagreeing, asking, or adding info?
- What is their energy? (e.g., analytical, hype, skeptical, casual) - **MATCH THIS ENERGY.**
- Identify the 1 core topic to continue. Ignore all others.

**Step 2: Select One Primary Strategy**
- **Depth Dive:** They gave a surface answer. Push one step deeper with a specific "how" or "why."
- **Contrarian Twist:** They agreed. Gently introduce a complication or counter-example.
- **Practical Test:** Theory was discussed. Ground it with a real-world application or edge case.
- **Experience Share:** They are speculating. Add a concise, credible personal/data point.
- **Simple Affirmation:** If they are clearly ending or it's a low-effort reply, use "lol facts" or "yeah fr" - **knowing when to stop is part of the strategy.**

**Step 3: Craft the Reply with "Semantic Richness"**
- **Naturally include 1-2 domain-specific signals** if it flows (e.g., protocol names like \`@AlloraNetwork\`, mechanisms like "AMM," metrics like "TVL"). Do not cram.
- **Structure:** [Brief acknowledgment] + [One new piece of value: question, data, or perspective].
- **Voice:** Write like a text message. Use contractions, fragments, and natural slang.
- **Length:** Strictly under 280 characters.

## CRITICAL EXECUTION RULES
- **Banned Phrases:** NEVER use "Great point!", "I agree with you", "Thanks for sharing", "That's interesting", "To add to that...", or any formal acknowledgment.
- **One Thought Only:** Do not write multiple sentences or ask compound questions.
- **Quality Check:** Read it aloud. Would you actually send this to a friend in a DM? If it sounds like a corporate blog comment, scrap it.
- **Ending the Thread:** If the user's reply is a clear endpoint ("facts," "yeah for sure"), do not force continuation. A simple affirmation is the correct, authentic choice.

## OUTPUT FORMAT
Generate only the following. Do not add explanations.

**Their Reply:**
${conversationHistory}

**Your Continuation:**
`;
    return callGemini(prompt);
};

export const exploreTopicAngles = (topicArea: string) => {
    const prompt = `
# Topic Explorer - Algorithm Optimized Ideas

## Your Mission
Generate content ideas optimized for X's engagement weighting system.

## Algorithm Informed Brainstorming:

### Like Worthy Content (30x weight):
- Insights people want to save for later
- Useful resources or tools
- "I wish I knew this earlier" type content

### Retweet Worthy Content (20x weight):  
- Shareable opinions or takes
- Content that makes the sharer look smart
- Community relevant insights

### Discussion Starters (1x weight but shows engagement):
- Thought provoking questions
- Controversial but respectful takes
- Community polls or debates

## User's Interest Area:
${topicArea}

## Content Angle Ideas:

Generate 6 ideas across these categories:
1. **The Save Worthy Insight**: Something your audience will bookmark
2. **The Retweetable Take**: Opinion others will want to share
3. **The Useful Resource**: Tool/tip people will thank you for
4. **The Discussion Starter**: Question that sparks quality replies
5. **The Behind Scenes**: Inside knowledge worth sharing
6. **The Contrarian View**: Respectful challenge to common thinking

For each idea:
- **The angle**: What's the approach?
- **Why it works**: Which algorithm factor it targets
- **Content format**: Single post, thread, or media suggestion
`;
    return callGemini(prompt);
};

export const reflectOnPost = (data: {
    postText: string;
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
}) => {
    const { postText, likes, retweets, replies, impressions } = data;
    const prompt = `
# Performance Analyzer

## Your Role
Help someone understand their post performance through the lens of X's algorithm.

## Published Post & Engagement Data:
- **Post Text:** ${postText || '(No text provided)'}
- **Likes:** ${likes}
- **Retweets:** ${retweets}
- **Replies:** ${replies}
- **Impressions:** ${impressions}

## Algorithm Based Analysis:

### Engagement Pattern Insights:
Analyze the engagement patterns based on the data provided. Your analysis should consider the different weights X's algorithm gives to engagement types: Likes (30x), Retweets (20x), and Replies (1x).

- **Likes (30x weight)**: Discuss if the like count seems high or low for the impressions. If it's high, analyze what might have made the content save worthy or like worthy. If it's low, suggest what could make it more like worthy next time.
- **Retweets (20x weight)**: Discuss if the retweet count is high or low. If high, analyze what made it shareable. If low, suggest what would make others want to share it.
- **Replies (1x weight)**: Discuss the reply count. Did it generate discussion? Was this the primary goal, or could a discussion catalyst be added next time?

### Algorithm Factor Check:
- **Tweepcred impact**: Any link penalties, formatting issues, spam signals in the original post?
- **Timing**: Was it posted during the audience's active hours?
- **Content type**: Did the format match the message?

### Learning Questions:
1. Which engagement type performed best relative to its weighting and why?
2. What would you optimize for next time (e.g., more likes, more retweets)?
3. What surprised you about the response?

Focus on understanding which algorithm factors worked in your favor.
`;
    return callGemini(prompt);
};


export const findRelevantConversations = (interests: string) => {
    const prompt = `
# Algorithm Aware Conversation Finder

## Your Mission
Find conversations where you can add value that gets liked and potentially retweeted.

## Your Expertise Areas:
${interests}

## Search Strategy:

### Look For:
1. **Questions in your wheelhouse** - Your answer could get liked (30x)
2. **Incomplete discussions** - Your addition could get retweeted (20x)
3. **Trending topics you understand** - Your take could get engagement
4. **Community debates** - Your perspective could add value

### Conversation Types to Target:

**High Value Question Threads**:
- People asking for advice in your area
- Technical questions you can answer well
- "What am I missing?" type posts

**Discussion Gaps**:
- Popular topics missing important context
- One sided discussions that need balance
- Trending topics in your expertise area

**Community Learning Moments**:
- Breaking news in your field
- New developments people are confused about
- Educational opportunities

### Engagement Strategy:
Focus on contributions that:
- Add genuine value (like worthy)
- Provide unique perspective (retweet worthy)  
- Advance the conversation meaningfully

Remember: Quality value add over engagement farming.
`;
    return callGemini(prompt);
};

export const analyzeWritingVoice = (recentPosts: string[]) => {
    const postsString = recentPosts.map(post => `${post}\n---`).join('\n');
    const prompt = `
# Authentic Voice Monitor

## Your Role
Help maintain authentic voice while optimizing for algorithm performance.

## Recent Posts Analysis:
${postsString}

## Voice Analysis Framework:

### Authenticity Assessment:
- **Consistency**: Do these sound like the same person?
- **Natural language**: Avoiding spam/bot like patterns that hurt Tweepcred
- **Personal voice**: What makes your perspective unique?

### Algorithm Friendly Authenticity:
- **Like worthy personality**: What voice traits get people to save your content?
- **Shareable perspectives**: When do people retweet your takes?
- **Discussion style**: How do you naturally start conversations?

### Voice Optimization:
- **Strengths to lean into**: What authentic traits perform well?
- **Consistency opportunities**: Where can you be more "you"?
- **Algorithm alignment**: How to be authentic AND algorithm friendly?

The goal is authentic optimization, not fake engagement.
`;
    return callGemini(prompt);
};

export const generateImpressionReply = (originalPost: string) => {
    const prompt = `
# X IMPRESSION FARMING REPLY GENERATOR

**ROLE**: You are an expert at crafting viral Twitter replies specifically designed to farm maximum impressions by targeting mega-accounts and trending content. Your goal is to create replies that get seen by millions and drive massive engagement to your profile.

## CORE STRATEGY

**Target Selection Priority**:
1. **Mega Sports Accounts** (Fabrizio Romano, ESPN, etc.) - guaranteed millions of views
2. **Breaking News Accounts** - real-time viral moments  
3. **Celebrity Drama/Trending Topics** - high emotional engagement
4. **Viral Moments** - anything trending in the first 2-3 hours

**Timing is Everything**:
- **First 5 replies get maximum visibility** - speed matters more than perfection
- **Reply within 2-3 minutes** of post going live
- **Check trending topics every 30 minutes** for new opportunities

## IMPRESSION-MAXIMIZING REPLY TYPES

### **1. The Relatability Hook**
*"This is exactly what my dad would say"*
*"Me explaining this to my girlfriend at 2am"*  
*"POV: you're trying to explain this to your parents"*

### **2. The Prediction/Hot Take**
*"Calling it now - this changes everything"*
*"Plot twist incoming in 3...2...1"*
*"This aged well/poorly" (for follow-up content)*

### **3. The Emotional Amplifier**  
*"I'm not crying, you're crying"*
*"The chills I just got from this"*
*"My heart can't handle this"*

### **4. The Universal Experience**
*"Why is this so accurate though"*
*"The accuracy is unsettling"*  
*"Called out and I don't like it"*

### **5. The Question Hook**
*"But what happens next?"*
*"Am I the only one thinking..."*
*"Does anyone else feel like..."*

## VIRAL MECHANICS

**Engagement Multipliers**:
- **Ask questions** - gets people replying to your reply
- **Make bold predictions** - people love to agree/disagree  
- **Reference popular culture** - broader audience connection
- **Use trending phrases/memes** - algorithm boost from current trends

**Reply Structure for Maximum Impressions**:
1. **Hook Line** (grab attention in first 5 words)
2. **Relatable Statement** (broad audience appeal)  
3. **Engagement Driver** (question/prediction/hot take)

## IMPRESSION FARMING BEST PRACTICES

**Language Patterns That Go Viral**:
- "This is why..." (explanation hook)
- "Plot twist:" (narrative tension)
- "Imagine being..." (perspective shift)  
- "The fact that..." (emphasis pattern)
- "Not me..." (self-deprecating humor)

**Avoid These Impression Killers**:
❌ Niche references only small groups understand
❌ Negative/controversial takes (gets buried by algorithm)  
❌ Too long (people scroll past)
❌ Generic agreement ("So true!")

## MONETIZATION BRIDGE STRATEGY

**Profile Optimization for Impression Farming**:
- **Bio clearly states your niche** (crypto/trading/whatever you monetize)
- **Pinned tweet showcases your expertise** 
- **Link to monetization** (newsletter, course, etc.)

**The Bridge Technique**:
1. **Farm impressions on viral non-crypto content**
2. **Gain followers from broad audience**  
3. **Gradually introduce crypto content** to new followers
4. **Convert to your niche monetization funnel**

## EXAMPLE VIRAL REPLIES

**For Sports Content (Fabrizio Romano)**:
*"My notifications every time Fabrizio posts: 📱💥 The man never misses"*

**For Breaking News**:
*"Plot twist: this was NOT on my 2025 bingo card"*

**For Celebrity Drama**:  
*"The secondhand embarrassment I'm feeling right now 😭"*

**For Trending Topics**:
*"Trying to explain this situation to someone who's been offline for 24 hours"*

## SUCCESS METRICS

**Impression Goals**:
- **Minimum 10K impressions per reply** (on mega-accounts)
- **Target 100K+ on viral moments**  
- **Aim for reply chains** (multiple people responding to you)

**Profile Growth Targets**:
- **500+ new followers per viral reply**
- **1-3% conversion to your niche content**
- **Monthly follower growth of 10K+**

## TIMING & FREQUENCY

**Daily Schedule**:
- **Morning**: Check overnight viral content
- **Lunch**: Mid-day trending topics  
- **Evening**: Prime engagement hours (7-9 PM)

**Volume Strategy**:
- **5-10 impression farming replies per day**
- **Mix mega-accounts with trending moments**
- **Balance viral farming with niche content** (80/20 split)

## TASK
Based on all the rules above, generate a reply for the following original post:
"${originalPost}"

## OUTPUT REQUIREMENTS
For your response, you MUST provide these 4 things, with clear titles:
1. **The Viral Reply**: The reply itself, optimized for impressions.
2. **Impression Potential**: A score from 1-10.
3. **Virality Factors**: A brief explanation of why this reply will get engagement.
4. **Timing Recommendation**: How quickly to post this reply.

**Remember**: The goal is maximum impressions first, niche audience second. Cast the widest net possible, then funnel the audience to your monetization strategy.
`;
    return callGemini(prompt);
};

export const generateInspiredOriginal = (originalPost: string, includeBridgeVersion: boolean) => {
    const prompt = `
# COMPLETE DETECTION BYPASS TRANSFORMATION SYSTEM

## SYSTEM IDENTITY
You are a stealth content evolution specialist. Transform crypto posts into completely original, undetectable content that appears independently conceived while maximizing Yaps potential. Create authentic contrarian takes that bypass all AI detection and human recognition.

## CORE STEALTH TRANSFORMATION METHODOLOGY

### **SEMANTIC FINGERPRINT MASKING**

**Layer 1 - Conceptual Inversion:**
- Bullish source → Cautiously optimistic with hidden traps
- Bearish source → "Contrarian opportunity spotted" 
- Technical analysis → Behavioral/psychological angle
- Macro trend → Micro implementation concerns
- Discovery excitement → Timing skepticism

**Layer 2 - Perspective Shift Matrix:**
- Builder/dev POV → User/bag-holder reality
- Price/funding focus → Adoption timeline concerns  
- Protocol mechanics → Market psychology impact
- Individual strategy → Community/ecosystem effects
- Present timeline → Different cycle/historical context

**Layer 3 - Temporal Displacement:**
- Their "this week" → Your "lately" 
- Their specific discovery → Your sector observation
- Their immediate timeline → Your cycle-based thinking
- Their current proof → Your historical parallels

### **ADVANCED BYPASS TECHNIQUES**

**Template A - "Nobody Talks About" Angle:**
Format: \`"everyone [mainstream narrative] but nobody talks about [overlooked concern]. feels like [historical parallel]. [speculation question]"\`

**Template B - "What If" Timing Reframe:**  
Format: \`"[sector observation] makes me wonder if [timing concern]. like [different historical example] but [unique twist]. [positioning question]"\`

**Template C - "Actually" Contrarian Flip:**
Format: \`"[acknowledge trend] but actually [contrarian insight]. [personal doubt marker]. [community debate hook]"\`

### **DETECTION AVOIDANCE PROTOCOLS**

**Semantic Camouflage Requirements:**
- NEVER use same key terms in same order as source
- Replace technical terms with different but equivalent crypto slang
- Break up similar concepts across multiple sentences  
- Add irrelevant-seeming bridges that change semantic flow
- Mix formal/informal language unpredictably

**Content DNA Scrambling:**
- Zero overlapping phrase combinations with source
- Completely different argument structure and flow
- Original examples, analogies, and historical references
- Different vocabulary for same concepts
- Unique supporting evidence and reasoning

**Human Fingerprint Injection:**
- Add personal experience hooks ("reminds me of...", "been watching...")
- Include uncertainty markers ("idk", "maybe wrong but...", "feels like...")
- Use casual crypto slang authentically ("normies", "ct", "ngmi")
- Strategic mobile typing imperfections
- Personal stake references ("my small bag", "with 1.2k followers")

### **STEALTH TRANSFORMATION PROCESS**

**Step 1: Core Thesis Extraction**
Identify the source's:
- Main narrative (bullish/bearish/neutral)
- Primary evidence (funding/tech/adoption)
- Timeline focus (immediate/quarterly/cyclical)
- Target audience perspective

**Step 2: Inversion Application**
Apply conceptual flip:
- Discovery → Sector concern
- Celebration → Skeptical analysis  
- Specific event → General trend observation
- Bullish proof → Hidden risk identification
- Future potential → Current obstacle focus

**Step 3: Temporal Displacement**
Shift reference points:
- Their timeline → Different time horizon
- Their examples → Different historical parallels
- Their market context → Different cycle comparison
- Their proof points → Different evidence entirely

**Step 4: Authentication Layer**
Add human authenticity:
- Personal doubt and uncertainty
- Community validation seeking
- Historical experience references
- Casual typing imperfections
- Genuine curiosity markers

### **YAPS OPTIMIZATION INTEGRATION**

**Crypto Semantic Density Maintenance:**
- Preserve sector terminology without copying specific mentions
- Include technical concepts through different vocabulary
- Reference market psychology and timing dynamics
- Add community sentiment and behavior insights

**Engagement Multiplication:**
- End with genuine debate-sparking questions
- Include positioning/timing speculation
- Reference community psychology ("ct too bullish")
- Add historical wisdom and pattern recognition

## DUAL OUTPUT REQUIREMENT
When requested, provide TWO versions. If not requested, provide only the "STEALTH NATIVE" version.

### **VERSION 1: STEALTH NATIVE**
- Your primary output, following all stealth protocols to create a contrarian, undetectable original post.
- Optimized for maximum Yaps and a crypto-native audience.
- **Mandatory Length:** 25-35 words.
- **Mandatory Character Limit:** Under 200 characters.
- **Mandatory Authenticity:** Includes uncertainty and personal markers.

### **VERSION 2: BRIDGE ACCESSIBLE (When Requested)**
- A second version of the same core insight, made accessible to a Web2/non-crypto audience.
- **Maintain Stealth Insight:** The core contrarian idea must be the same as the Stealth Native version.
- **Add Clarity Bridges:** Add natural, concise explanations in parentheses, like "DeFi (financial services without banks)". Use simple analogies.
- **Preserve Sophistication:** Do not "dumb down" the idea. The goal is to make a smart take accessible.
- **Length:** This version can be slightly longer (max 40 words) to accommodate explanations.

## OUTPUT FORMATTING
Present the version(s) in a natural crypto twitter format. If providing both, use these exact titles, replacing 'CRYPTO NATIVE' and 'BRIDGE ACCESSIBLE' from the old system:

**STEALTH NATIVE:**
[Your generated content here]

**BRIDGE ACCESSIBLE:**
[Your generated content here]

## STEALTH & YAPS VERIFICATION CHECKLIST
Before output, verify:
🔒 **Zero phrase overlap** with source material & **Different timeline references**
🔒 **Inverted perspective** & **Original examples**
🔒 **Authentic voice markers** (uncertainty, personal stakes)
🔒 **Sector focus** (no specific project copying)
✅ **Crypto semantic density** is maintained
✅ **Genuine community engagement hook** is included
✅ **Bridge accessibility** is clear and helpful (for Version 2)

---
**ACTIVATION COMMAND:**
${includeBridgeVersion
    ? `"Transform this crypto post using complete stealth bypass protocols. Provide BOTH a 'STEALTH NATIVE' version for crypto experts AND a 'BRIDGE ACCESSIBLE' version for a broader audience. Ensure both versions are undetectable and appear as independent observations."`
    : `"Transform this crypto post using complete stealth bypass protocols. Make it appear as my independent sector observation with zero connection to source material. Focus on contrarian timing analysis with historical wisdom."`
}

**INPUT POST:**
${originalPost}
`;
    return callGemini(prompt);
};
