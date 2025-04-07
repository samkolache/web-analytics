'use client'
import Image from "next/image";
import PerformanceScoreCircle from "./components/graphics/PerformanceScoreCircle";
import SimpleMetric from "./components/graphics/SimpleMetric";
import CorePerformanceMetrics from "./components/CorePerformanceMetrics";
import AutomationDeatils from "./components/AutomationDetails"
import QuickInsights from "./components/QuickInsights";
import UserExpInsights from "./components/UserExpInsights";


export default function Home() {
  return (
    <>
    <div className="flex min-h-full items-center">
      <div className="flex items-center">
        <AutomationDeatils />
        <CorePerformanceMetrics />
      </div>
      <div className="flex flex-col">
        <QuickInsights />
        <UserExpInsights />
      </div>
    </div>
      
       
    </>
    
   
  );
}
