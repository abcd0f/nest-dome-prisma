时区存储

mysql存储utc时间

```js
createTime DateTime  @default(now()) @db.DateTime(0)
updateTime DateTime @updatedAt @db.DateTime(0)
```

mysql存储本地时间

```js
createTime DateTime @default(dbgenerated("NOW()")) @db.DateTime
updateTime DateTime @default(dbgenerated("NOW() ON UPDATE NOW()")) @db.DateTime
```
