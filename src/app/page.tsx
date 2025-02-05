"use client";

import React, { useState } from "react";
import { FormData, initialFormData } from "@/types/form";
import PromotionBanner from "@/components/shared/PromotionBanner";
import TitleForm from "@/components/forms/TitleForm";
import StartDateForm from "@/components/forms/StartDateForm";
import MessageForm from "@/components/forms/MessageForm";
import PhotoForm from "@/components/forms/PhotoForm";
import MusicForm from "@/components/forms/MusicForm";
import BackgroundAnimationForm from "@/components/forms/BackgroundAnimationForm";
import PaymentForm from "@/components/forms/PaymentForm";
import PreviewFrame from "@/components/preview/PreviewFrame";

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const renderStep = () => {
    switch (formData.currentStep) {
      case 1:
        return (
          <TitleForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 1
              }));
            }}
            onPrevStep={() => {}}
          />
        );
      case 2:
        return (
          <StartDateForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 1
              }));
            }}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 1
              }));
            }}
          />
        );
      case 3:
        return (
          <MessageForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 1
              }));
            }}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 1
              }));
            }}
          />
        );
      case 4:
        return (
          <PhotoForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 1
              }));
            }}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 1
              }));
            }}
          />
        );
      case 5:
        return (
          <MusicForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 1
              }));
            }}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 1
              }));
            }}
          />
        );
      case 6:
        return (
          <BackgroundAnimationForm
            formData={formData}
            setFormData={setFormData}
            onNextStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep + 2 // Pula o step 7 (PlanForm)
              }));
            }}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 1
              }));
            }}
          />
        );
      case 8:
        return (
          <PaymentForm
            formData={formData}
            setFormData={setFormData}
            onPrevStep={() => {
              setFormData(prev => ({
                ...prev,
                currentStep: prev.currentStep - 2 // Volta 2 steps (pula o PlanForm)
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <PromotionBanner />
      </div>
      <main className="min-h-screen bg-[#111111] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>{renderStep()}</div>

          {/* Preview */}
          <div className="sticky top-8">
            <PreviewFrame formData={formData} />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
