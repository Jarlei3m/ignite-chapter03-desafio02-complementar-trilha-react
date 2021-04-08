import { useEffect, useRef } from 'react';
import styles from './comments.module.scss';

export default function Comments(): JSX.Element {
  const commentsEl = useRef<HTMLDivElement>();

  useEffect(() => {
    if (commentsEl) {
      const script = document.createElement('script');
      script.setAttribute('src', 'https://utteranc.es/client.js');
      script.setAttribute('crossorigin', 'anonymous');
      script.setAttribute('async', 'true');
      script.setAttribute(
        'repo',
        'Jarlei3m/ignite-chapter03-desafio02-complementar-trilha-react'
      );
      script.setAttribute('issue-term', 'title');
      script.setAttribute('theme', 'dark-blue');
      commentsEl.current.appendChild(script);
    }
  }, []);

  return <div className={styles.commentsContainer} ref={commentsEl} />;
}
