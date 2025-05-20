import { NextResponse } from "next/server"
import Replicate from "replicate";
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from 'resend';
import { EmailTemplate } from "@/components/email-templates/EmailTemplate";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    //console.log("Webhook is working", req)
   try{
     const body = await req.json()
     const url = new URL(req.url);

     const userId = url.searchParams.get("userId") ?? "";
     const modelName = url.searchParams.get("modelName") ?? "";
     const fileName = url.searchParams.get("fileName") ?? "";

     //validate the webhook
     const id = req.headers.get('webhook-id') ?? "";
     const timestamp = req.headers.get('webhook-timestamp') ?? "";
     const webhookSignature = req.headers.get('webhook-signature') ?? "";

     const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`
     const secret = await replicate.webhooks.default.secret.get();

     const secretBytes =  Buffer.from(secret.key.split('_')[1], "base64");
      const signature = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');
      console.log(signature);


      const expectedSignatures = webhookSignature.split(' ').map((sig) => sig.split(',')[1]);
      const isValid = expectedSignatures.some((expectedSignature) => expectedSignature === signature);
      if(!isValid){
        return new NextResponse("Invalid signature", {status:401})
      }

      //get user data
      const {data: user, error: userError} = await supabaseAdmin.auth.admin.getUserById(userId);

      if(userError || !user) {
        return new NextResponse("User not found!", {status:401})
      }

      const userEmail = user.user.email ?? "";
      const userName = user.user.user_metadata.full_name ?? "";
      console.log(userEmail)

      if(body.status === "succeeded"){
        //send email
        await resend.emails.send({
          from: 'Portfolio AI <vovantuananh040103@gmail.com>',
          to: [userEmail],
          subject: 'Model Training Completed',
          react: EmailTemplate({ userName, message: "Your model training has been completed!" }),
        });
      
        
        //Update supabase model table
        await supabaseAdmin.from("models").update({
          training_status: body.status,
          training_time: body.metrics?.total_time ?? null,
          version: body.output?.version.split(":")[1] ?? null,
        }).eq("user_id", userId).eq("model_name",modelName)
        //delete the training data from supabase storage


      }else{

        await resend.emails.send({
          from: 'Portfolio AI <vovantuananh040103@gmail.com>',
          to: [userEmail],
          subject: `Model Training ${body.status}`,
          react: EmailTemplate({ userName, message: `Your model training has been ${body.status}` }),
        });
      
        
        //Update supabase model table
        await supabaseAdmin.from("models").update({
          training_status: body.status,
        }).eq("user_id", userId).eq("model_name",modelName)

        //delete the training data from supabase storage


      }

      await supabaseAdmin.storage.from("training-data").remove([`${fileName}`])
     //console.log("webhooks is working fine", body)

     return new NextResponse("OK", {status:200})
   }catch(error){
        console.log("Webhook processing error: ",error)
        return new NextResponse("Internal server error,", {status:500 })
   }
}