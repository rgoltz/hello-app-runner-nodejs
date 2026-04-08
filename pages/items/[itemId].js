// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { unified } from "unified";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import useSwr, { mutate } from "swr";
import Link from "next/link";
import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Item() {
  const router = useRouter();
  const { itemId, title } = router.query;
  const { data, error } = useSwr(itemId ? `/api/items/${itemId}` : null, fetcher);
  const [detailHtml, setDetailHtml] = useState("");

  useEffect(() => {
    if (data && data.Detail) {
      const matterResult = matter(data.Detail);
      unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(matterResult.content)
        .then((result) => setDetailHtml(String(result)));

      if (data.Done === "n") {
        fetch(`/api/items/${data.ItemId}`, {
          method: "PUT",
          body: JSON.stringify({ done: "y" }),
          headers: { "Content-Type": "application/json" },
        }).then(() => mutate(`/api/items/${itemId}`));
      }
    }
  }, [data, itemId]);

  return (
    <Layout>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Head>
          {data ? (
            <title>{data.Title}</title>
          ) : (
            <>
              {error ? (
                <title>Item not found 😢</title>
              ) : (
                <title>Loading {itemId} ...</title>
              )}
            </>
          )}
        </Head>
        <section>
          {data ? (
            <>
              <h1 className={utilStyles.headingXl}>{data.Title}</h1>
              <div dangerouslySetInnerHTML={{ __html: detailHtml }} />
            </>
          ) : (
            <>
              <h1 className={utilStyles.headingXl}>{title}</h1>
              <div>{error ? "Item not found 😢" : "Loading ... ⏳"}</div>
            </>
          )}
        </section>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <div className={utilStyles.backToHome}>
          <Link href="/" className="back-button">
            {data ? "< Back to home" : ""}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
