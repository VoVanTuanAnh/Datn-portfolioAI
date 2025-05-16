'use client'

import React from "react"
import { Card, CardContent } from "../ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from "next/image"
import useGeneratedStore from "@/store/useGeneratedStore"
  

// const images = [
//     {
//         src: '/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg',
//         alt: 'some alt text',
//     },
//     {
//         src: '/hero-images/Poised Elegance of a Young Professional.jpeg',
//         alt: 'some alt text',
//     },
//     {
//         src: '/hero-images/Futuristic Helmet Portrait.jpeg',
//         alt: 'some alt text',
//     },
//     {
//         src: '/hero-images/Professional Business Portrait.jpeg',
//         alt: 'some alt text',
//     },
//     {
//         src: '/hero-images/Futuristic Woman in Armor.jpeg',
//         alt: 'some alt text',
//     }
// ]

const GenerateImages = () =>{

    const images = useGeneratedStore((state) => state.images)
    const loading = useGeneratedStore((state) => state.loading)
    if(images.length === 0){
        return <Card className='w-full max-w-2xl bg-muted'>
            <CardContent className='flex aspect-square items-center justify-center p-6'>
                <span className='text-2xl'>No Images Generated</span>
            </CardContent>
        </Card>
    }
    return(
        <Carousel className="w-full max-w-2xl">
            <CarouselContent>
                {images.map((image, index) => (
                <CarouselItem key={index}>
                    <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
                        <Image src={image.url} alt={"Generated using AI"} fill className='w-full h-full object-cover'/>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export default GenerateImages