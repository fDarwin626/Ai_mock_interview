import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

export async function GET(){
    return Response.json({ success: true, data: 'YUP IT WORKS!'},
        {status: 200}
    );  
}

export async function POST(request: Request){
    const { type, role, level, techstack, amount, userid} = await request.json();

    try{
        const {text: questions} = await generateText({
           model: google('gemini-2.0-flash-001'),
           prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            
            CRITICAL: Return Only a valid JSON array of questions,nothing else.
            Format exactly like this:
            ["Question 1", "Question 2", "Question 3"]

            Do not use special characters like "/" or "*" that might break voice assistants.

            Thank you! <3
        `,

        });

        // Extract JSON array from response (in case AI adds extra text)
        let parsedQuestions;
        try {
            // Try to find JSON array in the response
            const jsonMatch = questions.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                parsedQuestions = JSON.parse(jsonMatch[0]);
            } else {
                parsedQuestions = JSON.parse(questions);
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('AI Response was:', questions);
            throw new Error('Failed to parse AI response as JSON');
        }
        
        console.log('Parsed questions:', parsedQuestions);


        console.log('Raw AI Response:', questions);
        // now create a new interview variable to store to the db //
        const interview = {
             role,
             type,
             level, 
             techstack: techstack.split(','),
             questions: parsedQuestions,
             userId : userid,
             finalize: true,
             coverImage: getRandomInterviewCover(),
             createdAt: new Date().toISOString(),
        }
        // now store the intewview to the db
        await db.collection('interviews').add(interview);
        return Response.json({success: true}, {status: 200})
    }catch(e){
        console.error('FULL ERROR:' , e);
        return Response.json(
            { success: false,
               error: e instanceof Error? e.message : 'unknown error' }, 
            {status:500 }
        );
    }
}