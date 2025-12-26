"use client";
import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useThree, useFrame, ReactThreeFiber } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
  RigidBodyProps
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// 1. Extend Three.js Elements
extend({ MeshLineGeometry, MeshLineMaterial });

// 2. Add Type Support for MeshLine
// declare module "@react-three/fiber" {
//   interface ThreeElements {
//     meshLineGeometry: ReactThreeFiber.Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
//     meshLineMaterial: ReactThreeFiber.MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
//   }
// }

//3. Define the extended interface for logic usage
interface ExtendedRigidBody extends RapierRigidBody {
  lerped?: THREE.Vector3;
}

// 4. Preload Assets
useGLTF.preload("/glb/aanchalID.glb");
useTexture.preload("/images/band.jpg");

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      style={{
        width: isMobile ? "100vw" : "50vw",
        height: "100vh",
      }}
      
      gl={{ antialias: true }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#ffffff");
        gl.toneMapping = THREE.NoToneMapping;
        // Fix: Use modern ColorSpace API for newer Three.js versions
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.background = new THREE.Color("#ffffff");
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Physics
        debug={false}
        interpolate
        gravity={[0, -40, 0]}
        timeStep={1 / 60}
      >
        <Band />
      </Physics>
      <Environment background blur={0.75}>
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

function Band({ maxSpeed = 50, minSpeed = 10 }: BandProps) {
  // Fix: Initialize refs as standard RapierRigidBody to satisfy hooks
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  // Vectors
  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  // GLTF Loading
  const { nodes, materials } = useGLTF("/glb/aanchalID.glb") as any;
  const texture = useTexture("/images/band.jpg");
  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  // Fix: Explicitly cast refs for joints to avoid "Type null is not assignable" errors
  useRopeJoint(
    fixed as React.RefObject<RapierRigidBody>,
    j1 as React.RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1]
  );
  useRopeJoint(
    j1 as React.RefObject<RapierRigidBody>,
    j2 as React.RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1]
  );
  useRopeJoint(
    j2 as React.RefObject<RapierRigidBody>,
    j3 as React.RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 1]
  );
  useSphericalJoint(
    j3 as React.RefObject<RapierRigidBody>,
    card as React.RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 2.1, 0]]
  );

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      // Fix: Cast current refs to ExtendedRigidBody inside the loop to access .lerped safely
      const j1Extended = j1.current as ExtendedRigidBody;
      const j2Extended = j2.current as ExtendedRigidBody;

      [j1Extended, j2Extended].forEach((rb) => {
        if (!rb.lerped) {
          rb.lerped = new THREE.Vector3().copy(rb.translation());
        }

        const translation = rb.translation();
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, rb.lerped.distanceTo(translation))
        );

        rb.lerped.lerp(
          translation,
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      // Update Curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2Extended.lerped!);
      curve.points[2].copy(j1Extended.lerped!);
      curve.points[3].copy(fixed.current.translation());

      // Update Geometry
      // @ts-ignore: meshLine types can be finicky about setPoints
      band.current.geometry.setPoints(curve.getPoints(32));

      // Tilt Card
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation()))
              );
            }}
          >
            <primitive
              object={nodes.Scene || nodes.Card || Object.values(nodes)[0]}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(width, height)}
          useMap
          map={texture}
          repeat={new THREE.Vector2(-3, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}