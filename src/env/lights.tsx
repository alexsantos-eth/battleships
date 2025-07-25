const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} color="white" />

      <directionalLight
        color="white"
        intensity={1}
        position={[0, 10, 0]}
        castShadow={false}
      />
    </>
  );
};

export default Lights;
