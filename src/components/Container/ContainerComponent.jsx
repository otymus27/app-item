import style from './Container.module.css';

function Container({ children }) {
  return (
    <section className={style.container}>
      {/* aqui o conteudo será filho dessa section */}
      {children}
    </section>
  );
}

export default Container;
