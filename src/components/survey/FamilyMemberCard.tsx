"use client";

import { Trash2 } from "lucide-react";
import {
  MEMBER_EDUCATION_OPTIONS,
  MEMBER_GENDER_OPTIONS,
  MEMBER_MARITAL_OPTIONS,
  MEMBER_OCCUPATION_OPTIONS,
  RELATION_OPTIONS,
} from "@/lib/survey/options";
import type { FamilyMember } from "@/types/survey";

const inputClass =
  "w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#B45309]/50 focus:outline-none focus:ring-2 focus:ring-[#B45309]/15";

const labelClass =
  "mb-1.5 block font-telugu text-sm font-medium text-[#0F172A]";

type Props = {
  member: FamilyMember;
  index: number;
  canRemove: boolean;
  onChange: (next: FamilyMember) => void;
  onRemove: () => void;
};

export function FamilyMemberCard({
  member,
  index,
  canRemove,
  onChange,
  onRemove,
}: Props) {
  function patch(partial: Partial<FamilyMember>) {
    onChange({ ...member, ...partial });
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#FBFBFA] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-telugu text-sm font-semibold text-[#0F172A]">
          సభ్యుడు {index + 1}
          <span className="ml-1.5 text-xs font-normal text-[#64748B]">
            Member {index + 1}
          </span>
        </p>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="tap inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-[#64748B] hover:bg-white hover:text-red-600"
            aria-label={`Remove member ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <label className="block">
          <span className={labelClass}>పూర్తి పేరు · Full name *</span>
          <input
            required
            value={member.fullName}
            onChange={(e) => patch({ fullName: e.target.value })}
            className={`${inputClass} font-telugu`}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className={labelClass}>సంబంధం *</span>
            <select
              required
              value={member.relation}
              onChange={(e) =>
                patch({
                  relation: e.target.value as FamilyMember["relation"],
                })
              }
              className={`${inputClass} font-telugu`}
            >
              {RELATION_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>లింగం *</span>
            <select
              required
              value={member.gender}
              onChange={(e) =>
                patch({ gender: e.target.value as FamilyMember["gender"] })
              }
              className={`${inputClass} font-telugu`}
            >
              {MEMBER_GENDER_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te} ({o.label.en})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className={labelClass}>వయస్సు · Age *</span>
            <input
              required
              type="number"
              min={0}
              max={120}
              value={member.age === "" ? "" : member.age}
              onChange={(e) => {
                const v = e.target.value;
                patch({ age: v === "" ? "" : Number(v) });
              }}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>వైవాహిక స్థితి *</span>
            <select
              required
              value={member.maritalStatus}
              onChange={(e) =>
                patch({
                  maritalStatus: e.target
                    .value as FamilyMember["maritalStatus"],
                })
              }
              className={`${inputClass} font-telugu`}
            >
              {MEMBER_MARITAL_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className={labelClass}>విద్య *</span>
            <select
              required
              value={member.education}
              onChange={(e) =>
                patch({
                  education: e.target.value as FamilyMember["education"],
                })
              }
              className={`${inputClass} font-telugu`}
            >
              {MEMBER_EDUCATION_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>వృత్తి *</span>
            <select
              required
              value={member.occupation}
              onChange={(e) =>
                patch({
                  occupation: e.target.value as FamilyMember["occupation"],
                })
              }
              className={`${inputClass} font-telugu`}
            >
              {MEMBER_OCCUPATION_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label.te}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={member.isMatrimonialCandidate}
            onChange={(e) => {
              const on = e.target.checked;
              patch({
                isMatrimonialCandidate: on,
                height: on ? member.height || "" : undefined,
                gothram: on ? member.gothram || "" : undefined,
                workingLocation: on ? member.workingLocation || "" : undefined,
                guardianPhone: on ? member.guardianPhone || "" : undefined,
              });
            }}
            className="mt-1 h-4 w-4 accent-[#B45309]"
          />
          <span className="min-w-0">
            <span className="block font-telugu text-sm font-medium text-[#0F172A]">
              వివాహ ప్లాట్‌ఫామ్‌కు నమోదు చేయండి
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-[#64748B]">
              Register this member on the matrimonial platform on submit
            </span>
          </span>
        </label>

        {member.isMatrimonialCandidate ? (
          <div className="space-y-2.5 rounded-xl border border-[#B45309]/25 bg-[#B45309]/5 p-3">
            <p className="font-telugu text-xs font-semibold text-[#B45309]">
              వివాహ నమోదు వివరాలు
            </p>
            <p className="text-[11px] leading-snug text-[#92400E]">
              These fields register an eligible candidate for Nayi Samakhya
              matrimonial matching.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                value={member.height || ""}
                onChange={(e) => patch({ height: e.target.value })}
                placeholder="ఎత్తు · Height *"
                className={inputClass}
              />
              <input
                required
                value={member.gothram || ""}
                onChange={(e) => patch({ gothram: e.target.value })}
                placeholder="గోత్రం · Gothram *"
                className={`${inputClass} font-telugu`}
              />
            </div>
            <input
              value={member.workingLocation || ""}
              onChange={(e) => patch({ workingLocation: e.target.value })}
              placeholder="పని స్థలం · Working location"
              className={`${inputClass} font-telugu`}
            />
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={member.guardianPhone || ""}
              onChange={(e) =>
                patch({
                  guardianPhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              placeholder="సంరక్షక ఫోన్ · Guardian phone *"
              className={inputClass}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
