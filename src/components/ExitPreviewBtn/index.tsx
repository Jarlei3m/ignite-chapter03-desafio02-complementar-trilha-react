import Link from 'next/link';
import styles from './exitPreviewBtn.module.scss';

export default function ExitPreviewBtn(): JSX.Element {
  return (
    <aside className={styles.btnContainer}>
      <Link href="/api/exit-preview">
        <a>Sair do modo Preview</a>
      </Link>
    </aside>
  );
}
