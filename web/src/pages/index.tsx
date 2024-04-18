import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { Alert, Container, Table, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  data: { users: TUserItem[]; totalCount: number };
};

type TPaginationList = {
  lastPage: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

const PAGE_SIZE = 20;

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const { page=1, pageSize = PAGE_SIZE } = ctx.query;
  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&pageSize=${pageSize}`, { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, data: { users: [], totalCount: 1 } } };
    }

    return {
      props: { statusCode: 200, data: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, data: { users: [], totalCount: 1 } } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

function PaginationList({ lastPage, currentPage, handlePageChange }: TPaginationList) {
  const paginationItem = [];

  for (let maxPage = 10, index = (currentPage - 5)>1? currentPage - 5:1; index <= lastPage && maxPage > 0; index++, maxPage--) {
    paginationItem.push(
      <Pagination.Item onClick={() => handlePageChange(index)} active={index === currentPage}>
        {index}
      </Pagination.Item>
    );
  }
  return (
    <Pagination>
      <Pagination.First onClick={() => handlePageChange(1)} />
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
      {...paginationItem}
      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
      <Pagination.Last onClick={() => handlePageChange(lastPage)} />
    </Pagination>
  );
}

export default function Home({ statusCode, data }: TGetServerSideProps) {
  const router = useRouter();

  const { users, totalCount } = data;
  const lastPage = totalCount / PAGE_SIZE;
  const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber <= 1) {
      router.push(`/?page=${1}`);
    } else if (pageNumber >= lastPage) {
      router.push(`/?page=${lastPage}`);
    } else {
      router.push(`/?page=${pageNumber}`);
    }
  };

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationList lastPage={lastPage} currentPage={currentPage} handlePageChange={handlePageChange} />
        </Container>
      </main>
    </>
  );
}
