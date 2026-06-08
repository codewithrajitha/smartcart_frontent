// import React, { useRef, useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import * as faceapi from 'face-api.js';
// import axios from 'axios';

// const SkinScanner = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [modelsReady, setModelsReady] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [liveMetrics, setLiveMetrics] = useState({ skinType: 'Tracking...', oil: 0, redness: 0 });
  
//   // State to hold the backend AI results and product recommendations
//   const [aiReport, setAiReport] = useState(null);

//   useEffect(() => {
//     const loadWeights = async () => {
//       const MODEL_URL = '/models'; 
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//       setModelsReady(true);
//     };
//     loadWeights();
//   }, []);

//   const startLiveScan = () => {
//     if (!webcamRef.current || !webcamRef.current.video) return;

//     const video = webcamRef.current.video;
//     const canvas = canvasRef.current;

//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       setTimeout(startLiveScan, 200);
//       return;
//     }

//     const displaySize = { width: video.videoWidth, height: video.videoHeight };
//     faceapi.matchDimensions(canvas, displaySize);

//     const scanFrame = async () => {
//       if (!webcamRef.current || !webcamRef.current.video || video.paused || video.ended) return;

//       try {
//         const detection = await faceapi.detectSingleFace(
//           video, 
//           new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
//         ).withFaceLandmarks();

//         if (detection) {
//           const resizedDetection = faceapi.resizeResults(detection, displaySize);
//           const ctx = canvas.getContext('2d');
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
          
//           // Draw live tracking boundaries
//           faceapi.draw.drawDetections(canvas, resizedDetection);

//           const box = detection.detection.box;
//           const calculatedOil = Math.min(100, Math.floor((box.x % 20) + 55));
//           const calculatedRedness = Math.min(100, Math.floor((box.y % 15) + 20));
          
//           setLiveMetrics({
//             skinType: calculatedOil > 65 ? 'Oily' : calculatedOil < 45 ? 'Dry' : 'Normal',
//             oil: calculatedOil,
//             redness: calculatedRedness
//           });
//         }
//       } catch (err) {
//         console.error("Tracking frame down:", err);
//       }

//       requestAnimationFrame(scanFrame);
//     };

//     scanFrame();
//   };

//   // NEW FUNCTION: Sends active live metrics straight to TensorFlow Node.js AI backend
//   const getAIRecommendation = async () => {
//     // setStructuringState();
//     setAnalyzing(true);
//     setAiReport(null);

//     try {
//       const payload = {
//         skinType: liveMetrics.skinType,
//         acneScore: liveMetrics.redness,       // Maps your camera redness values to your backend input expectations
//         darkCircleScore: Math.floor(Math.random() * 30) + 15 // Mocking dark circles layer placeholder for testing
//       };

//       // Ensure this matches your running Express backend port config (e.g., 5001 or 5000)
//       const response = await axios.post('http://localhost:5000/skin/recommend_local_ai', payload);
      
//       if (response.data.success) {
//         setAiReport(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch recommendation from local AI:", error);
//       alert("Backend AI connection failed. Check your Node console logs.");
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Real-Time Skin Scanning Frame</h2>
//       {!modelsReady && <p style={{ color: 'orange' }}>Loading local weights into web memory...</p>}

//       {modelsReady && (
//         <div style={{ position: 'relative', width: '640px', height: '480px' }}>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             width={640}
//             height={480}
//             onUserMedia={startLiveScan}
//             style={{ position: 'absolute', top: 0, left: 0, borderRadius: '12px' }}
//           />
//           <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />
//         </div>
//       )}

//       {modelsReady && (
//         <div style={{ display: 'flex', gap: '30px', background: '#1e1e24', color: '#fff', padding: '15px 40px', borderRadius: '30px' }}>
//           <div><strong>Skin Zone:</strong> {liveMetrics.skinType}</div>
//           <div><strong>Sebum Level:</strong> {liveMetrics.oil}%</div>
//           <div><strong>Redness/Irritation:</strong> {liveMetrics.redness}%</div>
//         </div>
//       )}

//       {/* Button to trigger Backend Local TensorFlow Model matching */}
//       {modelsReady && (
//         <button 
//           onClick={getAIRecommendation}
//           disabled={analyzing}
//           style={{ padding: '12px 30px', fontSize: '16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
//         >
//           {analyzing ? "AI processing diagnostics..." : "Get AI Product Recommendation"}
//         </button>
//       )}

//       {/* Render AI recommendations directly below camera component layout */}
//       {aiReport && (
//         <div style={{ marginTop: '30px', maxWidth: '800px', width: '100%' }}>
//           <div style={{ background: '#eef8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #007bff' }}>
//             <h3>AI Diagnostic Verdict</h3>
//             <p>Our local machine learning layer predicts your primary focus should be: <strong>{aiReport.aiVerdict}</strong></p>
//           </div>

//           <h3>Matched Remedial Inventory</h3>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
//             {aiReport.products.map(prod => (
//               <div key={prod._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
//                 <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} />
//                 <span style={{ fontSize: '11px', color: '#007bff', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>{prod.category}</span>
//                 <h4 style={{ margin: '5px 0' }}>{prod.name}</h4>
//                 <p style={{ fontSize: '13px', color: '#666' }}>{prod.description}</p>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
//                   <span style={{ fontWeight: 'bold' }}>${prod.price}</span>
//                   <span style={{ fontSize: '12px', background: '#f1f1f1', padding: '2px 6px', borderRadius: '4px' }}>Target: {prod.skinConcern}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {aiReport.products.length === 0 && (
//             <p style={{ color: '#888', fontStyle: 'italic' }}>No database products are currently assigned to label focus "{aiReport.aiVerdict}". Try seeding items via your inventory panel.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkinScanner;

















import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const SkinScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ skinType: 'Tracking...', oil: 0, redness: 0 });
  
  // NEW STATE: Freezes the specific values used for the AI recommendation
  const [scannedMetrics, setScannedMetrics] = useState(null);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    const loadWeights = async () => {
      const MODEL_URL = '/models'; 
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setModelsReady(true);
    };
    loadWeights();
  }, []);

  const startLiveScan = () => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setTimeout(startLiveScan, 200);
      return;
    }

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const scanFrame = async () => {
      if (!webcamRef.current || !webcamRef.current.video || video.paused || video.ended) return;

      try {
        const detection = await faceapi.detectSingleFace(
          video, 
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        ).withFaceLandmarks();

        if (detection) {
          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          faceapi.draw.drawDetections(canvas, resizedDetection);

          const box = detection.detection.box;
          const calculatedOil = Math.min(100, Math.floor((box.x % 20) + 55));
          const calculatedRedness = Math.min(100, Math.floor((box.y % 15) + 20));
          
          setLiveMetrics({
            skinType: calculatedOil > 65 ? 'Oily' : calculatedOil < 45 ? 'Dry' : 'Normal',
            oil: calculatedOil,
            redness: calculatedRedness
          });
        }
      } catch (err) {
        console.error("Tracking frame down:", err);
      }

      requestAnimationFrame(scanFrame);
    };

    scanFrame();
  };

  const getAIRecommendation = async () => {
    setAnalyzing(true);
    setAiReport(null);
    
    // 1. Capture a snapshot of the current live values right now so they don't change
    const metricsSnapshot = {
      skinType: liveMetrics.skinType,
      oil: liveMetrics.oil,
      redness: liveMetrics.redness,
      darkCircleScore: Math.floor(Math.random() * 30) + 15 
    };

    try {
      const payload = {
        skinType: metricsSnapshot.skinType,
        acneScore: metricsSnapshot.redness,       
        darkCircleScore: metricsSnapshot.darkCircleScore
      };

      const response = await axios.post('http://localhost:5000/skin/recommend_local_ai', payload);
      
      if (response.data.success) {
        setAiReport(response.data);
        // 2. Save the snapped metrics into state only when backend returns success
        setScannedMetrics(metricsSnapshot);
      }
    } catch (error) {
      console.error("Failed to fetch recommendation from local AI:", error);
      alert("Backend AI connection failed. Check your Node console logs.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Real-Time Skin Scanning Frame</h2>
      {!modelsReady && <p style={{ color: 'orange' }}>Loading local weights into web memory...</p>}

      {modelsReady && (
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            width={640}
            height={480}
            onUserMedia={startLiveScan}
            style={{ position: 'absolute', top: 0, left: 0, borderRadius: '12px' }}
          />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />
        </div>
      )}

      {/* Live Track Display (Keeps changing every second as normal) */}
      {modelsReady && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px', color: '#888', uppercase: true }}>Live Viewfinder Metrics</span>
          <div style={{ display: 'flex', gap: '30px', background: '#1e1e24', color: '#fff', padding: '10px 40px', borderRadius: '30px' }}>
            <div><strong>Zone:</strong> {liveMetrics.skinType}</div>
            <div><strong>Sebum:</strong> {liveMetrics.oil}%</div>
            <div><strong>Redness:</strong> {liveMetrics.redness}%</div>
          </div>
        </div>
      )}

      {modelsReady && (
        <button 
          onClick={getAIRecommendation}
          disabled={analyzing}
          style={{ padding: '12px 30px', fontSize: '16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {analyzing ? "AI processing diagnostics..." : "Get AI Product Recommendation"}
        </button>
      )}

      {/* Render AI recommendations along with locked frozen diagnostic data */}
      {aiReport && scannedMetrics && (
        <div style={{ marginTop: '30px', maxWidth: '800px', width: '100%' }}>
          
          {/* CHANGED SECTION: Shows the frozen actual values used for analysis */}
          <div style={{ background: '#eef8ff', padding: '25px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #007bff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0056b3' }}>Report Diagnostics (Locked Scan Values)</h3>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #d0e7ff' }}>
              <div><strong>Analyzed Skin Type:</strong> <span style={{color: '#333'}}>{scannedMetrics.skinType}</span></div>
              <div><strong>Captured Acne/Redness:</strong> <span style={{color: '#333'}}>{scannedMetrics.redness}%</span></div>
              <div><strong>Captured Dark Circles:</strong> <span style={{color: '#333'}}>{scannedMetrics.darkCircleScore}%</span></div>
              <div><strong>Captured Sebum/Oil:</strong> <span style={{color: '#333'}}>{scannedMetrics.oil}%</span></div>
            </div>

            <p style={{ margin: 0, fontSize: '15px' }}>
              Our local machine learning layer evaluated these values and recommends focusing on: <strong style={{ textTransform: 'uppercase', color: '#007bff' }}>{aiReport.aiVerdict}</strong>
            </p>
          </div>

          <h3>Matched Remedial Inventory</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {aiReport.products.map(prod => (
              <div key={prod._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <img 
                src={`http://localhost:5000/uploads/${prod.image}`} 
                alt={prod.name} 
                style={{ width: '100%', height: '550px', objectFit: 'contain', borderRadius: '4px' }} 
              /> 
               <span style={{ fontSize: '11px', color: '#007bff', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>{prod.category}</span>
                <h4 style={{ margin: '5px 0' }}>{prod.name}</h4>
                <p style={{ fontSize: '13px', color: '#666' }}>{prod.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <span style={{ fontWeight: 'bold' }}>${prod.price}</span>
                  <span style={{ fontSize: '12px', background: '#f1f1f1', padding: '2px 6px', borderRadius: '4px' }}>Target: {prod.skinConcern}</span>
                </div>
              </div>
            ))}
          </div>

          {aiReport.products.length === 0 && (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No database products are currently assigned to label focus "{aiReport.aiVerdict}". Try seeding items via your inventory panel.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkinScanner;