import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CucaBottle3D() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-64 h-96 mx-auto perspective-1000">
      <motion.div
        className="relative w-full h-full transform-gpu"
        initial={{ rotateY: 0, rotateX: 0 }}
        animate={{ 
          rotateY: isVisible ? 360 : 0,
          rotateX: [0, 5, -5, 0]
        }}
        transition={{
          rotateY: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          },
          rotateX: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        {/* Bottle Body */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-t-3xl rounded-b-lg shadow-2xl"
          style={{
            transform: "translateZ(0px)",
            background: "linear-gradient(135deg, #d97706 0%, #92400e 50%, #78350f 100%)",
            boxShadow: "0 25px 50px -12px rgba(120, 53, 15, 0.5)"
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          {/* Bottle Neck */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-8 h-12 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-lg"></div>
          
          {/* Bottle Cap */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 w-10 h-6 bg-gradient-to-b from-red-600 to-red-700 rounded-t-lg shadow-lg"></div>
          
          {/* CUCA Label */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-white font-bold text-xl tracking-wider transform rotate-0">
              CUCA
            </div>
          </div>
          
          {/* Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-y-12 rounded-t-3xl rounded-b-lg"></div>
          
          {/* Liquid Inside */}
          <motion.div
            className="absolute bottom-2 left-2 right-2 h-3/4 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 rounded-b-lg opacity-80"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Foam/Bubbles Effect */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-200 to-transparent rounded-t-lg opacity-60"></div>
            
            {/* Bubble Animation */}
            <motion.div
              className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-200 rounded-full opacity-70"
              animate={{
                y: [-20, -60],
                opacity: [0.7, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute bottom-8 right-6 w-1 h-1 bg-yellow-300 rounded-full opacity-60"
              animate={{
                y: [-15, -45],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-50"
              animate={{
                y: [-25, -55],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1
              }}
            />
          </motion.div>
        </motion.div>
        
        {/* Floating Sparkles */}
        <motion.div
          className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full opacity-80"
          animate={{
            y: [-10, -20, -10],
            x: [-5, 5, -5],
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-6 w-3 h-3 bg-amber-400 rounded-full opacity-70"
          animate={{
            y: [10, 0, 10],
            x: [5, -5, 5],
            scale: [1, 0.8, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-8 w-2 h-2 bg-red-400 rounded-full opacity-60"
          animate={{
            y: [0, -15, 0],
            x: [-8, 8, -8],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </motion.div>
      
      {/* Shadow */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black opacity-20 rounded-full blur-sm"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}