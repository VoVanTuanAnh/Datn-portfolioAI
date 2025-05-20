import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

const WEBHOOK_URL = process.env.SITE_URL ?? 'https://1b97-2001-ee1-fa3d-6c50-b5a9-40eb-f67c-434b.ngrok-free.app'

export async function POST(request: NextRequest) {
    try{
        if(!process.env.REPLICATE_API_TOKEN){
            throw new Error("The replicate api token is not set!")
        }

        const supabase = await createClient();
        const {data: {user}} = await supabase.auth.getUser()
        if(!user){
            return NextResponse.json({
                error:"Unauthorized"
            },{status: 401})
        }

        const formData = await request.formData();
        const input = {
            fileKey: formData.get("fileKey") as string,
            modelName: formData.get("modelName") as string,
            gender: formData.get("gender") as string,
        }

        if(!input.fileKey || !input.modelName){
            return NextResponse.json({error: "Missing required field!"},{status:400})
        }

        const fileName = input.fileKey.replace("training-data/","");

        const {data: fileUrl} = await supabaseAdmin.storage.from("training-data").createSignedUrl(fileName, 3600)

        if(!fileUrl?.signedUrl){
            throw new Error("Failed to get the file URL")
        }

        console.log(fileUrl)

        //create model first
        //const hardware = await replicate.hardware.list();
        const modelId = `${user.id}_${Date.now()}_${input.modelName.toLowerCase().replaceAll(" ","_")}`

        await replicate.models.create("vovantuananh", modelId, {
            visibility:"private",
            hardware:"gpu-a100-large"
        })

        //for train
        const training = await replicate.trainings.create(
            "ostris",
            "flux-dev-lora-trainer",
            "c6e78d2501e8088876e99ef21e4460d0dc121af7a4b786b9a4c2d75c620e300d",
            {
              // You need to create a model on Replicate that will be the destination for the trained version.
              destination: `vovantuananh/${modelId}`,
              input: {
                steps: 1000,
                resolution: "1024",
                input_images: fileUrl.signedUrl,
                trigger_word: "WTA",
              },
              webhook: `${WEBHOOK_URL}/api/webhooks/training?userId=${user.id}&modelName=${encodeURIComponent(input.modelName)}&fileName=${encodeURIComponent(fileName)}`,
              webhook_events_filter: ["completed"], // optional
            }
          );

          //save model values
          await supabaseAdmin.from("models").insert({
            model_id: modelId,
            user_id: user.id,
            model_name: input.modelName,
            gender: input.gender,
            training_status: training.status,
            trigger_word: "WTA",
            training_steps: 1200,
            training_id: training.id
          })

        return NextResponse.json({
            success: true
        },{status: 201})

    //console.log(training)

    }catch(error){
        console.error("Trainning Error: ", error)

        const errorMessage = error instanceof Error ? error.message : "Fail to start the model training!"
        return NextResponse.json({
            error: errorMessage
        },{status: 500})
    }
    
}