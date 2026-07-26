/**
 * Plan data for the query latency lab. Shapes, indexes, and the before/after
 * timings are modeled on the Trybl work that cut read latency from 100 ms+ to
 * under a millisecond; the lab replays this data rather than hitting a database.
 */

export interface IndexOption {
  id: string;
  ddl: string;
  note: string;
}

export interface PlanVariant {
  /** Index ids that must all be enabled for the planner to choose this path. */
  requires: string[];
  node: string;
  lines: string[];
  ms: number;
  rowsScanned: number;
  rowsReturned: number;
  takeaway: string;
}

export interface QueryShape {
  id: string;
  label: string;
  table: string;
  tableRows: number;
  sql: string[];
  indexes: IndexOption[];
  /** Ordered from no-index baseline to fully indexed. */
  plans: PlanVariant[];
}

export const queryShapes: QueryShape[] = [
  {
    id: "feed",
    label: "Feed for a user",
    table: "posts",
    tableRows: 482_000,
    sql: [
      "SELECT p.id, p.body, p.created_at",
      "FROM posts p",
      "JOIN memberships m ON m.group_id = p.group_id",
      "WHERE m.user_id = $1",
      "  AND p.created_at > now() - interval '7 days'",
      "ORDER BY p.created_at DESC",
      "LIMIT 50;",
    ],
    indexes: [
      {
        id: "memberships_user",
        ddl: "CREATE INDEX ON memberships (user_id);",
        note: "Stops the join from scanning every membership row.",
      },
      {
        id: "posts_group_created",
        ddl: "CREATE INDEX ON posts (group_id, created_at DESC);",
        note: "Serves the filter and the ORDER BY from one ordered path.",
      },
      {
        id: "posts_covering",
        ddl: "CREATE INDEX ON posts (group_id, created_at DESC) INCLUDE (body);",
        note: "Covering index: the heap is never touched.",
      },
    ],
    plans: [
      {
        requires: [],
        node: "Seq Scan + Hash Join + external Sort",
        ms: 118.42,
        rowsScanned: 573_400,
        rowsReturned: 50,
        takeaway: "Reads the whole table, sorts on disk, throws away 99.99% of it.",
        lines: [
          "Limit  (cost=8492.11..8492.24 rows=50 width=96)",
          "  ->  Sort  (cost=8492.11..8613.62 rows=48590 width=96)",
          "        Sort Key: p.created_at DESC",
          "        Sort Method: external merge  Disk: 5416kB",
          "        ->  Hash Join  (cost=712.44..6104.90 rows=48590 width=96)",
          "              Hash Cond: (p.group_id = m.group_id)",
          "              ->  Seq Scan on posts p  (rows=482000 loops=1)",
          "                    Rows Removed by Filter: 433410",
          "              ->  Hash  (rows=91400)",
          "                    ->  Seq Scan on memberships m  (rows=91400)",
          "Planning Time: 0.182 ms",
          "Execution Time: 118.42 ms",
        ],
      },
      {
        requires: ["memberships_user"],
        node: "Nested Loop + Seq Scan on posts",
        ms: 41.86,
        rowsScanned: 96_400,
        rowsReturned: 50,
        takeaway: "The join side is fixed, but posts is still read sequentially.",
        lines: [
          "Limit  (cost=3120.60..3120.73 rows=50 width=96)",
          "  ->  Sort  (cost=3120.60..3164.22 rows=17448 width=96)",
          "        Sort Key: p.created_at DESC",
          "        ->  Nested Loop  (cost=0.42..2618.14 rows=17448 width=96)",
          "              ->  Index Scan using memberships_user_idx on memberships m  (rows=24)",
          "                    Index Cond: (user_id = $1)",
          "              ->  Seq Scan on posts p  (rows=482000 loops=1)",
          "Planning Time: 0.164 ms",
          "Execution Time: 41.86 ms",
        ],
      },
      {
        requires: ["memberships_user", "posts_group_created"],
        node: "Index Scan, no sort",
        ms: 2.31,
        rowsScanned: 1_240,
        rowsReturned: 50,
        takeaway: "Ordered index means LIMIT 50 stops after 50 rows. No sort at all.",
        lines: [
          "Limit  (cost=0.85..14.62 rows=50 width=96)",
          "  ->  Nested Loop  (cost=0.85..4802.10 rows=17448 width=96)",
          "        ->  Index Scan using memberships_user_idx on memberships m  (rows=24)",
          "              Index Cond: (user_id = $1)",
          "        ->  Index Scan using posts_group_created_idx on posts p  (rows=52 loops=24)",
          "              Index Cond: ((group_id = m.group_id) AND (created_at > (now() - '7 days')))",
          "Planning Time: 0.147 ms",
          "Execution Time: 2.31 ms",
        ],
      },
      {
        requires: ["memberships_user", "posts_group_created", "posts_covering"],
        node: "Index Only Scan",
        ms: 0.72,
        rowsScanned: 50,
        rowsReturned: 50,
        takeaway: "Index-only: 50 rows scanned for 50 rows returned, zero heap fetches.",
        lines: [
          "Limit  (cost=0.85..9.18 rows=50 width=96)",
          "  ->  Nested Loop  (cost=0.85..2904.55 rows=17448 width=96)",
          "        ->  Index Scan using memberships_user_idx on memberships m  (rows=24)",
          "        ->  Index Only Scan using posts_covering_idx on posts p  (rows=50 loops=24)",
          "              Index Cond: ((group_id = m.group_id) AND (created_at > (now() - '7 days')))",
          "              Heap Fetches: 0",
          "Planning Time: 0.151 ms",
          "Execution Time: 0.72 ms",
        ],
      },
    ],
  },
  {
    id: "search",
    label: "Search people by school",
    table: "users",
    tableRows: 214_000,
    sql: [
      "SELECT id, display_name, school_id",
      "FROM users",
      "WHERE school_id = $1",
      "  AND lower(display_name) LIKE lower($2) || '%'",
      "ORDER BY display_name",
      "LIMIT 25;",
    ],
    indexes: [
      {
        id: "users_school",
        ddl: "CREATE INDEX ON users (school_id);",
        note: "Narrows 214k users to one campus.",
      },
      {
        id: "users_school_name",
        ddl: "CREATE INDEX ON users (school_id, lower(display_name) text_pattern_ops);",
        note: "Prefix matching inside the campus, already in sort order.",
      },
    ],
    plans: [
      {
        requires: [],
        node: "Seq Scan + Sort",
        ms: 63.4,
        rowsScanned: 214_000,
        rowsReturned: 25,
        takeaway: "Every user row read and lowercased just to find 25 names.",
        lines: [
          "Limit  (cost=4198.77..4198.83 rows=25 width=64)",
          "  ->  Sort  (cost=4198.77..4203.19 rows=1768 width=64)",
          "        Sort Key: display_name",
          "        ->  Seq Scan on users  (rows=214000 loops=1)",
          "              Filter: ((school_id = $1) AND (lower(display_name) ~~ ...))",
          "              Rows Removed by Filter: 212232",
          "Planning Time: 0.121 ms",
          "Execution Time: 63.40 ms",
        ],
      },
      {
        requires: ["users_school"],
        node: "Bitmap Heap Scan + Sort",
        ms: 8.9,
        rowsScanned: 11_300,
        rowsReturned: 25,
        takeaway: "One campus instead of the world, but still filtering and sorting in memory.",
        lines: [
          "Limit  (cost=812.44..812.50 rows=25 width=64)",
          "  ->  Sort  (cost=812.44..816.86 rows=1768 width=64)",
          "        Sort Key: display_name",
          "        Sort Method: quicksort  Memory: 244kB",
          "        ->  Bitmap Heap Scan on users  (rows=11300 loops=1)",
          "              Recheck Cond: (school_id = $1)",
          "              ->  Bitmap Index Scan using users_school_idx  (rows=11300)",
          "Planning Time: 0.118 ms",
          "Execution Time: 8.90 ms",
        ],
      },
      {
        requires: ["users_school", "users_school_name"],
        node: "Index Scan, no sort",
        ms: 0.41,
        rowsScanned: 25,
        rowsReturned: 25,
        takeaway: "Prefix range read straight off the index in sorted order.",
        lines: [
          "Limit  (cost=0.42..6.10 rows=25 width=64)",
          "  ->  Index Scan using users_school_name_idx on users  (rows=25 loops=1)",
          "        Index Cond: ((school_id = $1) AND (lower(display_name) ~>=~ ...))",
          "Planning Time: 0.109 ms",
          "Execution Time: 0.41 ms",
        ],
      },
    ],
  },
  {
    id: "messages",
    label: "Messages since timestamp",
    table: "messages",
    tableRows: 1_940_000,
    sql: [
      "SELECT id, sender_id, body, sent_at",
      "FROM messages",
      "WHERE conversation_id = $1",
      "  AND sent_at > $2",
      "  AND deleted_at IS NULL",
      "ORDER BY sent_at",
      "LIMIT 100;",
    ],
    indexes: [
      {
        id: "messages_conversation",
        ddl: "CREATE INDEX ON messages (conversation_id);",
        note: "Finds the conversation without a full scan.",
      },
      {
        id: "messages_conv_sent",
        ddl: "CREATE INDEX ON messages (conversation_id, sent_at);",
        note: "Range scan on sent_at with no sort step.",
      },
      {
        id: "messages_partial",
        ddl: "CREATE INDEX ON messages (conversation_id, sent_at) WHERE deleted_at IS NULL;",
        note: "Partial index: deleted rows never enter the index.",
      },
    ],
    plans: [
      {
        requires: [],
        node: "Seq Scan + Sort",
        ms: 214.7,
        rowsScanned: 1_940_000,
        rowsReturned: 100,
        takeaway: "Two million rows read per poll — this is what pagination on a chat screen felt like.",
        lines: [
          "Limit  (cost=41902.55..41902.80 rows=100 width=148)",
          "  ->  Sort  (cost=41902.55..41947.10 rows=17820 width=148)",
          "        Sort Key: sent_at",
          "        Sort Method: external merge  Disk: 21480kB",
          "        ->  Seq Scan on messages  (rows=1940000 loops=1)",
          "              Filter: ((conversation_id = $1) AND (sent_at > $2) AND (deleted_at IS NULL))",
          "              Rows Removed by Filter: 1922180",
          "Planning Time: 0.204 ms",
          "Execution Time: 214.70 ms",
        ],
      },
      {
        requires: ["messages_conversation"],
        node: "Bitmap Heap Scan + Sort",
        ms: 18.3,
        rowsScanned: 24_800,
        rowsReturned: 100,
        takeaway: "Right conversation, wrong access pattern: the whole history is still sorted every call.",
        lines: [
          "Limit  (cost=2984.10..2984.35 rows=100 width=148)",
          "  ->  Sort  (cost=2984.10..3046.15 rows=24800 width=148)",
          "        Sort Key: sent_at",
          "        ->  Bitmap Heap Scan on messages  (rows=24800 loops=1)",
          "              Recheck Cond: (conversation_id = $1)",
          "              ->  Bitmap Index Scan using messages_conversation_idx  (rows=24800)",
          "Planning Time: 0.186 ms",
          "Execution Time: 18.30 ms",
        ],
      },
      {
        requires: ["messages_conversation", "messages_conv_sent"],
        node: "Index Scan on composite",
        ms: 1.14,
        rowsScanned: 640,
        rowsReturned: 100,
        takeaway: "Composite index turns the poll into a bounded range read.",
        lines: [
          "Limit  (cost=0.56..38.20 rows=100 width=148)",
          "  ->  Index Scan using messages_conv_sent_idx on messages  (rows=100 loops=1)",
          "        Index Cond: ((conversation_id = $1) AND (sent_at > $2))",
          "        Filter: (deleted_at IS NULL)",
          "        Rows Removed by Filter: 540",
          "Planning Time: 0.171 ms",
          "Execution Time: 1.14 ms",
        ],
      },
      {
        requires: ["messages_conversation", "messages_conv_sent", "messages_partial"],
        node: "Index Scan on partial index",
        ms: 0.38,
        rowsScanned: 100,
        rowsReturned: 100,
        takeaway: "Deleted rows are gone from the index, so nothing is read to be thrown away.",
        lines: [
          "Limit  (cost=0.43..12.88 rows=100 width=148)",
          "  ->  Index Scan using messages_partial_idx on messages  (rows=100 loops=1)",
          "        Index Cond: ((conversation_id = $1) AND (sent_at > $2))",
          "Planning Time: 0.158 ms",
          "Execution Time: 0.38 ms",
        ],
      },
    ],
  },
];

/** Best plan the planner could pick given the enabled indexes. */
export const resolvePlan = (shape: QueryShape, enabled: string[]): PlanVariant =>
  shape.plans.reduce((best, plan) => (plan.requires.every((id) => enabled.includes(id)) ? plan : best), shape.plans[0]);
