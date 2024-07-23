import HomeButton from './HomeButton';

const Header = () => {
  return (
    <div style={{ width: '100%', height: 120, backgroundColor: 'white' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          height: '100%',
          marginLeft: 40,
        }}
      >
        <HomeButton />
      </div>
    </div>
  );
};

export default Header;
