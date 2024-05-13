
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css'
const heartColor = 'rgba(255,142,244,1)'
const SIZE = 500
const BezierLonger = [
  [60, 250], [120, 160], [180, 80], [280, 60], [380, 80], [420, 180], [420, 280],
  [400, 360], [340, 420], [250, 460], [180, 460], [80, 420], [40, 340],
]
const BezierShoter = [
  [120, 220], [200, 180], [260, 140], [340, 180], [320, 280], [200, 340], [260, 320], [160, 300],
]


interface AnimatePath {
  id: string,
  path: string,
  during: number,
  size: number,
  rotate: number,
  orign: number[]
}
const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [longerPaths, setLongerPaths] = useState<AnimatePath[]>([]);
  const [shortPaths, setShortPaths] = useState<AnimatePath[]>([]);
  const [paths] = useState<string[]>([]);
  const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const genarateLongerPaths = () => {
    const longerPaths: AnimatePath[] = []
      ; ([0, 1, 2, 3]).forEach((num) => {
        BezierLonger.map((end) => {
          const start = [SIZE / 2, SIZE / 2]
          const q = [(start[0] + end[0]) / 2 - 20, (start[1] + end[1]) / 2 - 20]
          const path = `M${start[0]},${start[1]} Q${q[0]},${q[1]} ${end[0]},${end[1]}`
          const size = getRandom(0, 2)
          const during = getRandom(2, 10)
          const rotate = getRandom(-20 * num, 30 * num)
          longerPaths.push({
            id: `path${longerPaths.length}`,
            path,
            during: during,
            size: 25 + size * 5,
            rotate,
            orign: [0 * num * 5, 0 * num * 5]
          })
          if (!paths.includes(path)) {
            paths.push(path)
          }
        })
      })
    setLongerPaths(longerPaths)
  }
  const genarateShortPaths = () => {
    const longerPaths: AnimatePath[] = []
      ; ([2, 4]).forEach((num) => {
        BezierShoter.map((end) => {
          const start = [SIZE / 2, SIZE / 2]
          const q = [(start[0] + end[0]) / 2 - 20, (start[1] + end[1]) / 2 - 20]
          const path = `M${start[0]},${start[1]} Q${q[0]},${q[1]} ${end[0]},${end[1]}`
          const size = getRandom(0, 2)
          const during = getRandom(4, 10)
          const rotate = getRandom(-20 * num, 30 * num)
          longerPaths.push({
            id: `path${longerPaths.length}`,
            path,
            during: during,
            size: 25 + size * 5,
            rotate,
            orign: [0 * num * 5, 0 * num * 5]
          })
          if (!paths.includes(path)) {
            paths.push(path)
          }
        })
      })
    setShortPaths(longerPaths)
  }
  const getHeartGroup = (data: AnimatePath) => {
    const { path, during, size, id, rotate, orign } = data
    return <g filter="url(#heartFilter)" stroke={'none'} fill={heartColor} key={id} transform={`rotate(${rotate})`}>
      <use xlinkHref="#symbol" x={orign[0]} y={orign[1]} width={size} height={size} />
      <use xlinkHref="#symbol" x={orign[0]} y={orign[1]} width={size} height={size} />
      <use xlinkHref="#symbol" x={orign[0]} y={orign[1]} width={size} height={size} />
      <animateMotion dur={`${during}s`} repeatCount="indefinite" path={path} />
    </g>
  }
  const HeartLonger = useMemo(() => {
    return longerPaths.map((item) => {
      return getHeartGroup(item)
    })
  }, [longerPaths])
  const HeartShorter = useMemo(() => {
    return shortPaths.map((item) => {
      return getHeartGroup(item)
    })
  }, [shortPaths])
  useEffect(() => {
    if (longerPaths.length === 0) {
      genarateLongerPaths()
    }
  }, [longerPaths])
  useEffect(() => {
    if (longerPaths.length > 0 && shortPaths.length === 0) {
      genarateShortPaths()
    }
  }, [longerPaths, shortPaths])
  return (
    <div id="www" ref={ref} >
      <svg viewBox="0 0 500 500" width={SIZE} height={SIZE}>
        <defs>
          {/* Filter declaration  */}
          <filter
            id="heartFilter"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100">
            {/* offsetBlur */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
            {/* litPaint  */}
            <feSpecularLighting
              in="blur"
              surfaceScale="2"
              specularConstant=".5"
              specularExponent="20"
              lightingColor="#eee"
              result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />

            </feSpecularLighting>
            <feComposite
              in="specOut"
              in2="SourceAlpha"
              operator="in"
              result="specOut" />
            <feComposite
              in="SourceGraphic"
              in2="specOut"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litPaint" />
            {/* merge offsetBlur + litPaint  */}
            {/* <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litPaint" />
            </feMerge> */}
          </filter>
        </defs>
        <symbol id="symbol" viewBox="0 0 200 200">
          <path d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
        </symbol>
        {/* <g stroke='black' fill='none'>
          {paths.map((item, index) => {
            return <path d={item} key={index} />
          })}
        </g> */}
        <g stroke='none'>
          {HeartLonger}
          {HeartShorter}
        </g>
      </svg>
    </div>
  );
};
export default Home;

