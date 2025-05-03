import { DefaultSession, DefaultUser } from "next-auth";

/**
 * 这里声明你希望 `session.user` 拥有什么字段
 * - `DefaultUser` 自带 `name | email | image`
 * - 我们额外把 `id` 加进来
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];      // ⬅︎ 保留 name/email/image
  }

  interface User extends DefaultUser {
    id: string;                      // ⬅︎ 根据你数据库 schema 自行扩展
  }
}
