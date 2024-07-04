import React from 'react';
import { useMyStore } from './hooks/useMyStore';
import { Canvas } from '@react-three/fiber';
import {
  useGLTF,
  OrbitControls,
  MeshRefractionMaterial,
  Environment,
  useProgress,
  Html,
  useCubeTexture,
} from '@react-three/drei';
import { BlendFunction } from 'postprocessing';
import {
  DepthOfField,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { Color, MeshStandardMaterial } from 'three';

//Gem part
function Gems(props) {
  const ref = React.useRef();
  const texture = useCubeTexture(
    ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
    { path: 'htmltest/3d/gemmap/' },
  );
  const { nodes } = useGLTF('/htmltest/3d/gem.glb');
  const values = props.color.split('/');
  return (
    <group ref={ref} rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <mesh
        geometry={
          nodes['Layer_01(F515426E-294D-4FC4-832F-9BAC280D6A14)'].geometry
        }
        castShadow
        receiveShadow
      >
        <MeshRefractionMaterial
          envMap={texture}
          bounces={2}
          aberrationStrength={0}
          ior={parseFloat(values[1])}
          color={values[0]}
          fastChroma
        />
      </mesh>
    </group>
  );
}

//Metal mesh
function MyMesh({ color, geometry, material }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      // Clone the material to avoid modifying the original
      const updatedMaterial = new MeshStandardMaterial();
      updatedMaterial.copy(material);
      updatedMaterial.setValues({ color: new Color(color) });
      ref.current.material = updatedMaterial;
    }
  }, [color]);
  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
    />
  );
}

//Rest part of the model
function Model(props) {
  const { nodes, materials } = useGLTF('/htmltest/3d/met.glb');
  return (
    <group {...props} dispose={null}>
      <group scale={0.001}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <MyMesh
            geometry={
              nodes['COLOR=�,MATERIAL=��(17C38827-CF04-41A3-BD5C-83A1DBCE0B94)']
                .geometry
            }
            material={materials['Silver Polished #1']}
            color={props.color}
          />
          <MyMesh
            geometry={
              nodes['Layer_01(D0460141-C391-4238-B6C5-F8AD57FB3D13)'].geometry
            }
            material={materials['Silver Polished #1']}
            color={props.color}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/htmltest/3d/met.glb');
useGLTF.preload('/htmltest/3d/gem.glb');

function Viewer3d({ storePrefix, defaultValues, classNames = '' }) {
  const [metalState, metalStateSet] = useMyStore(
    `${storePrefix}Metal`,
    defaultValues[0],
  );
  const [gemState, gemStateSet] = useMyStore(
    `${storePrefix}Gem`,
    defaultValues[1],
  );
  function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }
  return (
    <div className={classNames}>
      <Canvas shadows camera={{ fov: 60, position: [10, 40, 30] }} dpr={[1, 2]}>
        <Environment
          files={'/htmltest/3d/Ring_Studio_011_V4.hdr'}
          environmentIntensity={1}
        />
        <color attach="background" args={['#fff']} />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
          enableDamping={false}
          minDistance={3}
          maxDistance={3}
        />
        <EffectComposer>
          <DepthOfField focusDistance={0.1} focalLength={0.5} bokehScale={2} />
          <Vignette
            offset={0.5}
            darkness={0.5}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
        <React.Suspense fallback={<Loader />}>
          <Model scale={100} color={metalState} />
          <Gems scale={0.1} color={gemState} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

export { Viewer3d };
