import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Bagging Explorer | Interactive Ensemble Learning</title>
        <meta name="description" content="Learn about bagging and ensemble methods through interactive machine learning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen gradient-bg">
        {children}
      </div>
    </>
  );
}