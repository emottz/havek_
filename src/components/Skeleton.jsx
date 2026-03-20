import React from 'react'
import './Skeleton.css'

/** Single product card skeleton — matches catalog-card / atolye-card layout */
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="sk sk--image" />
      <div className="skeleton-card__body">
        <div className="sk sk--title" />
        <div className="sk sk--line" />
        <div className="sk sk--line sk--line--short" />
        <div className="sk sk--btn" />
      </div>
    </div>
  )
}

/** Full product detail page skeleton */
export function SkeletonProductDetail() {
  return (
    <div className="skeleton-detail container">
      <div className="sk sk--line skeleton-detail__breadcrumb" />
      <div className="skeleton-detail__layout">
        <div className="skeleton-detail__gallery">
          <div className="sk sk--main" />
          <div className="sk--thumbs">
            {[0, 1, 2].map(i => <div key={i} className="sk sk--thumb" />)}
          </div>
        </div>
        <div className="skeleton-detail__info">
          <div className="sk sk--title-lg" />
          <div className="sk sk--divider" />
          <div className="sk sk--line sk--meta" />
          <div className="sk sk--line sk--meta" />
          <div className="sk sk--desc-title" />
          <div className="sk sk--line" />
          <div className="sk sk--line" />
          <div className="sk sk--line sk--line--short" />
          <div className="sk sk--btn-lg" />
        </div>
      </div>
    </div>
  )
}
