export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-jsx file.
   */
  return (
    <div>
      <style jsx>{`
        .wrapper {
          display: flex;
          height: 100vh;
          align-items: center;
        }
        .logo {
          width: 500px;
          max-width: 80%;
        }
        .welcome {
          text-align: center;
        }
        h1 {
          margin-top: .5em;
          font-size: 3rem;
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1;
          color: #aaa;
        }
      `}</style>

      <div className="wrapper">
        <div className="container">
          <div className="welcome">
            <img src="/logo/logo_light_full.svg" className='logo' />
            <h1>
              Will be back!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;