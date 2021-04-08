import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import ExitPreviewBtn from '../components/ExitPreviewBtn';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [pagePosts, setPagePosts] = useState(postsPagination.results);

  async function handleNextPage(): Promise<any> {
    try {
      const newPostResults = await fetch(`${nextPage}`).then(response =>
        response.json()
      );

      const { next_page } = newPostResults;

      const results = newPostResults.results.map((post: Post) => {
        return {
          uid: post.uid,
          first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yy',
            {
              locale: ptBR,
            }
          ),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        };
      });

      results.map(item => {
        return setPagePosts(oldState => [...oldState, item]);
      });
      setNextPage(next_page);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title> Home | Spacetraveling </title>
      </Head>

      <main className={styles.container}>
        <article className={styles.posts}>
          <img src="" alt="logo" />
          {pagePosts.map(post => {
            const { title, subtitle, author } = post.data;
            return (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <strong>{title}</strong>
                  <p>{subtitle}</p>
                  <div className={commonStyles.postInfo}>
                    <time>
                      <FiCalendar />
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </time>
                    <p>
                      <FiUser /> {author}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </article>
        {nextPage && (
          <button
            onClick={() => handleNextPage()}
            type="button"
            className={styles.loadButton}
          >
            Carregar mais posts
          </button>
        )}
        {preview && <ExitPreviewBtn />}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
      ref: previewData?.ref ?? null,
    }
  );

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = { next_page, results };

  return {
    props: { postsPagination, preview },
  };
};
