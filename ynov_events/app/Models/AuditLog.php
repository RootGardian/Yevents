<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'user_type',
        'action',
        'description',
        'model_type',
        'model_id',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'metadata' => 'json',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        if ($this->user_type === 'Admin') {
            return $this->belongsTo(Admin::class, 'user_id');
        }
        return $this->belongsTo(User::class, 'user_id');
    }
}
