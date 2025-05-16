'use client'
import React, { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import useGeneratedStore from "@/store/useGeneratedStore"


 
export const ImageGenerationFormSchema = z.object({
  model: z.string({
    required_error:'Model is required !'
  }),
  prompt: z.string({
    required_error:'Prompt is required !'
  }), 
  guidance: z.number({
    required_error:'Guidance is required !'
  }),
  num_outputs: z.number().min(1,{message: 'Number of outputs should be at least 1.'}).max(4,{message: 'Number of outputs must be less than 4.'}),
  aspect_ratio: z.string({
    required_error:'Aspect ratio is required !'
  }),
  output_format: z.string({
    required_error:'Output format is required !'
  }),
  output_quality: z.number().min(0,{message: 'Output quality should be at least 1.'}).max(100,{message: 'Output quality must be less than 100.'}),
  num_inference_steps: z.number().min(1,{message: 'num inference steps should be at least 1.'}).max(50,{message: 'num inference steps must be less than 50.'}),
})

const Configurations = () =>{

    const generateImage = useGeneratedStore((state) => state.generateImage)
    const form = useForm<z.infer<typeof ImageGenerationFormSchema>>({
        resolver: zodResolver(ImageGenerationFormSchema),
        defaultValues: {
            model: "black-forest-labs/flux-dev",
            prompt: "",
            guidance: 3.5,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "jpg",
            output_quality: 80,
            num_inference_steps: 28,
        },
      })

      useEffect(() => {
        const subscription = form.watch((value,{name}) =>{
          if(name === 'model'){
            let newSteps;

            if(value.model === 'black-forest-labs/flux-schnell'){
              newSteps = 4
            }else{
              newSteps = 28
            }

            if(newSteps !== undefined){
              form.setValue('num_inference_steps', newSteps)
            }
          }
          
        })

        return () => subscription.unsubscribe()
        }, [form])
     
      async function onSubmit(values: z.infer<typeof ImageGenerationFormSchema>) {
        await generateImage(values)
      }

    return(
      <TooltipProvider>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="grid gap-6 p-4 bg-background rounded-lg border-8 border-double border-cyan-500">
              <legend className="text-xl -ml-1 px-1 font-medium text-cyan-500">
                Setting
              </legend>

              <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Model
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You can select any model from the drop menu.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="black-forest-labs/flux-dev">Flux Dev</SelectItem>
                    <SelectItem value="black-forest-labs/flux-schnell">Flux Schnell</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className='grid grid-cols-2 gap-4'>
            <FormField
            control={form.control}
            name="aspect_ratio"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Aspect Ratio
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aspect ratio for the generated image.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="9:16">9:16</SelectItem>
                    <SelectItem value="21:9">21:9</SelectItem>
                    <SelectItem value="9:21">9:21</SelectItem>
                    <SelectItem value="4:5">4:5</SelectItem>
                    <SelectItem value="5:4">5:4</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="3:4">3:4</SelectItem>
                    <SelectItem value="2:3">2:3</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

          <FormField
            control={form.control}
            name="num_outputs"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Number of  Outputs
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number output images to generate.</p>
                    </TooltipContent>
                  </Tooltip>
                  </FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={4} {...field} 
                  onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          <FormField
            control={form.control}
            name="guidance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    Guidance
                    <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4"/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Prompt guidence for generated.</p>
                    </TooltipContent>
                  </Tooltip>
                  </div>
                  <span>
                    {field.value}
                  </span></FormLabel>
                <FormControl>
                <Slider defaultValue={[field.value]} min={0} max={10} step={0.5} 
                onValueChange={value => field.onChange(value[0])}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_inference_steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    Number of Inference Steps
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4"/>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of denoising steps. Recommended range is 28 - 50 for dev mode and 1 - 4 for schnell model.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span>
                    {field.value}
                  </span></FormLabel>
                <FormControl>
                <Slider defaultValue={[field.value]} min={1} max={
                    form.getValues("model") === 'black-forest-labs/flux-schnell' ? 4 : 50
                  } step={1} 
                onValueChange={value => field.onChange(value[0])}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="output_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    Output Quality
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4"/>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quality when sabing the output image, from 0 to 100. 100 is the best quality.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span>
                    {field.value}
                  </span></FormLabel>
                <FormControl>
                <Slider defaultValue={[field.value]} min={50} max={100} step={1} 
                onValueChange={value => field.onChange(value[0])}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="output_format"
            render={({ field }) => (
                <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Output Format
                  <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4"/>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Format of the output images.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  Prompt
                  <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4"/>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p> Prompt for generated images.</p>
                      </TooltipContent>
                    </Tooltip>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={6}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="font-medium">Generate</Button>
          </fieldset>
            
        </form>
        </Form>
      </TooltipProvider>      
    )
}
export default Configurations;