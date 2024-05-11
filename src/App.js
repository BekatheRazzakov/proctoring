import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const width = 500;
const height = 500;

const App = () => {
  const [isLookingForward, setIsLookingForward] = useState(false);

  const { webcamRef, boundingBox, detected, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });

  useEffect(() => {
    const checkLookingForward = () => {
      if (boundingBox.length > 0) {
        const box = boundingBox[0];

        const eyeMidpointX = box.xCenter * width;
        const eyeMidpointY = box.yCenter * height;

        const distanceX = Math.abs(eyeMidpointX - width / 2);
        const distanceY = Math.abs(eyeMidpointY - height / 2);

        const maxDistance = width * 0.4;
        const isCentered = distanceX < maxDistance && distanceY < maxDistance;

        setIsLookingForward(isCentered);
      } else {
        setIsLookingForward(false);
      }
    };

    checkLookingForward();
  }, [boundingBox]);

  return (
    <div>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p>
      <p>{`Looking forward: ${isLookingForward ? 'Yes' : 'No'}`}</p>
      <div style={{ width, height, position: 'relative' }}>
        {boundingBox.map((box, index) => (
          <div
            key={`${index + 1}`}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <Webcam
          ref={webcamRef}
          forceScreenshotSourceSize
          style={{
            height,
            width,
            position: 'absolute',
          }}
        />
      </div>
    </div>
  );
};

export default App;
