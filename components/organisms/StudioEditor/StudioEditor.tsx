'use client'
import EditingOverview from '@/components/molecules/EditiongOverview/EditingOverview'
import TransformationPanel from '@/components/molecules/TransformationPanel/TransformationPanel'
import TrnasformationsList from '@/components/molecules/TransformationsList/TrnasformationsList'
import { useTransform } from '@/hooks/useTransform'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const StudioEditor = () => {
    const { imageId } = useParams<{ imageId: string }>()

    const {
        image, transformed, loading, error,
        activeStep, setActiveStep,
        pending, updatePending, hasPendingChanges,
        applying, applyError, applyTransform,
    } = useTransform(imageId)

    if (loading) return <Loader />
    if (error) return <div>error</div>

    return (
        <div className='text-white flex flex-col lg:flex-row md:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden'>
            <TrnasformationsList active={activeStep} setActive={setActiveStep} pending={pending} />
            <EditingOverview image={image} transformed={transformed} pending={pending} cropActive={activeStep.key === 'crop'} onCropChange={(crop) => updatePending('crop', crop)}/>
            <TransformationPanel
                active={activeStep}
                pending={pending}
                onChange={updatePending}
                onApply={applyTransform}
                applying={applying}
                hasPendingChanges={hasPendingChanges}
                applyError={applyError}
            />
        </div>
    )
}

export default StudioEditor