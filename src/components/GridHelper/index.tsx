const GridHelper: React.FC = () => {
  return (
    <gridHelper
      args={[5, 10, "#ddd", "#ddd"]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0.21]}
    />
  );
};

export default GridHelper;
