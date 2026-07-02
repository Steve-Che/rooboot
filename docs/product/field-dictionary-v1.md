# 字段字典 V1（MVP）

## 1. 用户与组织

### User
- id: string，用户ID
- phone: string，手机号（脱敏展示）
- name: string，昵称/姓名
- role: enum(`customer`,`store_owner`,`technician`,`operator`)
- city: string，常驻城市
- createdAt: datetime

### Organization
- id: string，组织ID
- name: string，门店/公司名
- type: enum(`store`,`platform`)
- city: string
- qualificationStatus: enum(`pending`,`approved`,`rejected`)
- createdAt: datetime

## 2. 设备资产

### RobotDevice
- id: string，设备ID
- ownerUserId: string
- brand: string
- model: string
- serialNumber: string（唯一）
- category: enum(`home_cleaning`,`window_cleaning`,`delivery`,`commercial_cleaning`)
- purchaseDate: date
- firmwareVersion: string
- conditionLevel: enum(`A`,`B`,`C`,`D`)
- createdAt: datetime
- updatedAt: datetime

## 3. 检测与维保

### InspectionOrder
- id: string
- userId: string
- deviceId: string
- storeId: string
- serviceMode: enum(`on_site`,`in_store`)
- problemDescription: string
- status: enum(`pending`,`assigned`,`inspecting`,`reported`,`closed`,`cancelled`)
- appointmentAt: datetime
- createdAt: datetime
- updatedAt: datetime

### InspectionReport
- id: string
- orderId: string
- overallScore: int（0-100）
- batteryHealth: int（0-100）
- motorHealth: int（0-100）
- sensorHealth: int（0-100）
- navigationHealth: int（0-100）
- safetyRiskLevel: enum(`low`,`medium`,`high`)
- suggestedActions: string
- mediaUrls: string[]
- createdAt: datetime

### MaintenanceOrder
- id: string
- inspectionOrderId: string
- quoteAmount: decimal(10,2)
- finalAmount: decimal(10,2)
- status: enum(`quoted`,`confirmed`,`in_progress`,`completed`,`warranty`)
- warrantyDays: int
- completedAt: datetime
- createdAt: datetime
- updatedAt: datetime

## 4. 二手交易

### Listing
- id: string
- sellerUserId: string
- deviceId: string
- title: string
- expectedPrice: decimal(10,2)
- city: string
- listingStatus: enum(`draft`,`published`,`negotiating`,`closed`,`removed`)
- hasInspectionReport: boolean
- createdAt: datetime
- updatedAt: datetime

### Offer
- id: string
- listingId: string
- buyerUserId: string
- offerPrice: decimal(10,2)
- message: string
- status: enum(`sent`,`accepted`,`rejected`,`expired`)
- createdAt: datetime

## 5. 风险与审计

### RiskEvent
- id: string
- entityType: enum(`device`,`order`,`listing`,`user`)
- entityId: string
- riskType: enum(`serial_mismatch`,`stolen_suspected`,`fake_report`,`abnormal_price`)
- riskLevel: enum(`P1`,`P2`,`P3`)
- description: string
- createdAt: datetime

### AuditLog
- id: string
- actorUserId: string
- action: string
- targetType: string
- targetId: string
- metadata: json
- createdAt: datetime
