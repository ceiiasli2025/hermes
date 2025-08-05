import { FC, useState, useEffect } from 'react';
import WaveformCanvas from '@/components/waveform-canvas';

interface WaveformProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

const Waveform: FC<WaveformProps> = ({ user }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-full">
        <div className="lg:col-span-3 bg-[#151618] relative flex items-center">
          <WaveformCanvas
            color="#20D71E"
            frequency={user.ecgBpm / 60}
            amplitude={0.8}
            time={time}
            waveType="ecg"
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-center animate-pulse gap-2">
          <div className="text-white text-4xl font-bold">{user.ecgBpm}</div>
          <div className="text-white text-xl font-medium">ECG bpm</div>
        </div>
        <div className="lg:col-span-3 bg-[#151618] relative flex items-center">
          <WaveformCanvas
            color="#C6CF44"
            frequency={user.ecgBpm / 60}
            amplitude={0.6}
            time={time}
            waveType="spo2"
          />
        </div>
         <div className="p-4 flex flex-col items-center justify-center animate-pulse gap-2">
          <div className="text-white text-4xl font-bold">{user.spo2}</div>
          <div className="text-white text-xl font-medium">SPO2 %</div>
        </div>
        <div className="lg:col-span-3 bg-[#151618] relative flex items-center">
          <WaveformCanvas
            color="#971D25"
            frequency={user.ecgBpm / 60}
            amplitude={0.7}
            time={time}
            waveType="bp"
            systolic={user.systolic}
            diastolic={user.diastolic}
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-center animate-pulse gap-2">
          <div className="text-white text-4xl font-bold">
            {user.systolic}/{user.diastolic}
          </div>
          <div className="text-white text-xl font-medium">SYS/DIA</div>
          <div className="text-white text-xl font-medium">NIBP mmHG</div>
        </div>
        <div className="lg:col-span-3 bg-[#151618] relative flex items-center">
          <WaveformCanvas
            color="#fff"
            frequency={user.respiratoryRate / 60}
            amplitude={0.5}
            time={time}
            waveType="etco2"
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-center animate-pulse gap-2">
          <div className="text-white text-4xl font-bold">{user.respiratoryRate}</div>
          <div className="text-white text-xl font-medium">RR rpm</div>
        </div>
      </div>
    </>
  );
};

export default Waveform;