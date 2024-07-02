import React from 'react';
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

const Switcher = ({ values, label, active, handler }) => {
  const baseclass = `w-24 px-4 py-2 text-sm font-medium border-black text-black border hover:bg-gray-800 hover:text-white`;
  const activeclass = `z-10 bg-black text-white`;
  return (
    <div
      className={`flex justify-center items-center flex-row w-full`}
      role="group"
    >
      <div className={`pr-2 w-14 text-right`}>{label}</div>
      {values.map((val) => {
        return (
          <button
            type="button"
            className={`${baseclass} border ${
              val.value === active.value ? activeclass : `bg-transparent`
            }`}
            onClick={(e) => handler(e.target.value)}
            key={'' + val.name + val.value}
            value={val.value}
          >
            {val.name}
          </button>
        );
      })}
    </div>
  );
};
function Viewer3d({ config }) {
  const [activeMetal, setActiveMetal] = React.useState(config.metals[1].value);
  const [activeGem, setActiveGem] = React.useState(config.gems[0].value);
  const metals = config.metals; //[`Silver`, `Gold`, `Pink`];
  const gems = config.gems; //[`Diamond`, `Emerald`, `Sapphire`];
  function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }
  return (
    <div
      className={`flex flex-col justify-center items-center h-[60vh] md:h-[85vh]`}
    >
      <div
        className={`z-40 bg-white grid gap-2 grid-rows-2 grid-cols-1 w-full pb-4`}
      >
        <Switcher
          values={metals}
          label={`Metal`}
          active={activeMetal}
          handler={setActiveMetal}
        />
        <Switcher
          values={gems}
          label={`Gem`}
          active={activeGem}
          handler={setActiveGem}
        />
      </div>
      <div className={`aspect-square max-w-full flex-grow`}>
        <Canvas
          shadows
          camera={{ fov: 60, position: [10, 40, 30] }}
          dpr={[1, 2]}
        >
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
            <DepthOfField
              focusDistance={0.1}
              focalLength={0.5}
              bokehScale={2}
            />
            <Vignette
              offset={0.5}
              darkness={0.5}
              eskil={false}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
          <React.Suspense fallback={<Loader />}>
            <Model scale={100} color={activeMetal} />
            <Gems scale={0.1} color={activeGem} />
          </React.Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export { Viewer3d };
