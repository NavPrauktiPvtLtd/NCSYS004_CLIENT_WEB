import { useEffect, useState } from 'react'

interface Props {
    textArray: [string,string,string];
    totalDuration: number;
    currentDuration: number
}

function useGetTestStatusText({
    textArray,totalDuration,currentDuration
}: Props) {
    const [currentStatusText,setCurrentStatusText] = useState(textArray[0])
    useEffect(()=>{
        const currentTestPercent = (currentDuration * totalDuration) / 100
        if(currentTestPercent < 30){
            setCurrentStatusText(textArray[0])
          }else if(currentTestPercent < 70){
            setCurrentStatusText(textArray[1])
          }else{
            setCurrentStatusText(textArray[2])
          } 
    },[textArray,currentDuration,totalDuration])
    return {currentStatusText}
}

export default useGetTestStatusText
